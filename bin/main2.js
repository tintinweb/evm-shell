#!/usr/bin/env node
'use strict'
/**
 * @author github.com/tintinweb
 * @license MIT
 * */
const Vorpal = require('vorpal');
const c = require('chalk');
const fs = require('fs');
const os = require('os');
const path = require('path');

const BN = require('bn.js')
const Common = require('@ethereumjs/common').default
const { Chain, Hardfork } = require('@ethereumjs/common')
const VM = require('@ethereumjs/vm').default


function printState(state, cb){
    cb(`[pc      ]: ${state.runState.programCounter}`)
    cb(`[code    ]: 0x${state.runState.code.toString('hex')}`)
    cb(`[gasUsed ]: ${state.gasUsed}`)
    cb(`[stack   ]: ${JSON.stringify(state.runState.stack._store)}`)
    cb(`[memory  ]: ${JSON.stringify(state.runState.memory._store)}`)
    cb(`[logs    ]: ${JSON.stringify(state.runState.logs)}`)
}

function convertToHexString(d){
    let ret = Number(d)
    if (isNaN(ret)){
        throw new Error("Invalid input value!")
    }
    let hexStr = ret.toString(16)
    return hexStr.padStart(hexStr.length + hexStr.length % 2, '0')
}

class State {
    constructor(data) {
        this.data = data;
    }
}

class EvmTrace {
    constructor(settings) {
        this.settings = {
            ...{
                chain: Chain.Mainnet,
                hardfork: Hardfork.London
            }, ...(settings || {})
        }


        this.reset()
    }

    reset() {
        let common = new Common(this.settings)
        this.common = common
        this.vm = new VM({ common })
        this.opcodes = this.vm.getActiveOpcodes()
        this.opcodeNames = this._getOpcodeNameMap()

        this.steps = [];
        this.lastState = undefined;

        this.vm.on('step', (data) => {
            this.steps.push(new State(data))
        })
    }

    _getOpcodeNameMap() {
        let names = new Map()
        for (let opcode of this.opcodes.values()) {
            names.set(opcode.fullName.toLowerCase(), opcode)
        }
        return names
    }

    run(code) {
        let that = this;
        return new Promise((resolve, reject) => {
            this.vm.runCode({
                code: Buffer.from(code.join(''), 'hex'),
                gasLimit: new BN(0xfffffffff),
            })
            .then((results) => {
                that.lastState = results;
                return resolve(that) // returns .steps, .result
            })
            .catch(err => {
                console.log(err)
                console.log("ERRR")
                return reject(err)
            })
        })
    }

    runNext(code) {
        let previousCode = []
        if(this.lastState && this.lastState.runState && this.lastState.runState.code) {
            previousCode = [...this.lastState.runState.code].map(convertToHexString)
        }
        let nextCode = [...previousCode, ...code]
        this.reset()
        return this.run(nextCode)
    }

}



let evm = new EvmTrace()

const vorpal = new Vorpal()
    .delimiter(c.bold('» '))
    .show()
    .parse(process.argv);

vorpal
    .command('.reset')
    .action((args, cb) => {
        evm.reset()
        return cb("reset!");
    });

vorpal
    .command('.opcodes')
    .action((args, cb) => {
        return cb(evm.opcodeNames.keys());
    });

vorpal
    .command('.step [step]')
    .action((args, cb) => {
        let index = evm.steps.length -1; //last by default
        if(args.step){
            index = parseInt(args.step)
        }
        console.log(index)
        return cb(evm.steps[index]);
    });

vorpal
    .command('.stack')
    .action((args, cb) => {
        let index = evm.steps.length -1; //last by default
        if(args.length >0){
            index = parseInt(args[0])
        }
        return cb(evm.steps[index].data.stack);
    });

vorpal
    .command('.memory')
    .alias('.mem')
    .action((args, cb) => {
        let index = evm.steps.length -1; //last by default
        if(args.length >0){
            index = parseInt(args[0])
        }
        return cb(evm.steps[index].data.memory);
    });

vorpal
    .command('.state')
    .action((args, cb) => {
        return cb(evm.lastState);
    });

vorpal
    .command('.logs')
    .action((args, cb) => {
        return cb(evm.logs);
    });

vorpal
    .command('.disasm')
    .action((args, cb) => {
        evm.steps.forEach(e => vorpal.log(`${e.data.pc.toString().padStart(6)} - ${e.data.opcode.name}`))
        return cb(true)
    })


vorpal
    .command('.load <hexstr>')
    .action(function (args, cb) {
        let cmd = this.commandWrapper.command.split(' ',2)[1];
        if(cmd.startsWith('0x')){
            cmd = cmd.substring(2)
        }

        if(!(cmd.length % 2 === 0) || ! /^[0-9A-Fa-f]+$/g.test(cmd)){
            vorpal.log(c.red(`Error: Uneven or Non-Hex input provided: '${cmd}'.`))
            //vorpal.execSync("help")
            return cb(false)
        } 
        let code = [...Buffer.from(cmd, 'hex')].map(convertToHexString)


        evm.runNext(code).then(state => {
            vorpal.ui.imprint()
            vorpal.log('Trace:\n')
            evm.steps.forEach(e => vorpal.log(`${e.data.pc.toString().padStart(6)} - ${e.data.opcode.name}`))
            vorpal.log('-------------------------------------------------------------')
            printState(state.lastState, (msg)=>{vorpal.log(msg)})
            
            cb(c.bold(c.yellow(state.lastState.returnValue.toString('hex'))))

            if(state.lastState.exceptionError){
                vorpal.log(c.bold(c.red(`⚠️  Revert: ${JSON.stringify(state.lastState.exceptionError)}`)))
                evm.reset()
            }
            return
        })
    });

for (let [mnemonic, opcode] of evm.opcodeNames.entries()) {
    vorpal
        .command(`${mnemonic} [args...]`)
        .validate((args) => {
            if(!args || !args.args){
                return true;
            }
            try {
                args.args.map(convertToHexString)
                return true;
            } catch (e) {
                return e
            }
        })
        .action((args, cb) => {
            let cmdargs = args.args || []
            cmdargs = cmdargs.map(convertToHexString)
            let codeIncrement = [convertToHexString(opcode.code), ...cmdargs]
            
            evm.runNext(codeIncrement).then(state => {
                vorpal.ui.imprint()
                vorpal.log('-------------------------------------------------------------')

                printState(state.lastState, (msg)=>{vorpal.log(msg)})
                cb(c.bold(c.yellow(state.lastState.returnValue.toString('hex'))))

                if(state.lastState.exceptionError){
                    vorpal.log(c.bold(c.red(`⚠️  Revert: ${JSON.stringify(state.lastState.exceptionError)}`)))
                    evm.reset()
                }
                return
            })
        })
}

/** wrapper for push that autodetects push1-32 */
vorpal
    .command(`push <args>`)
    .action(function (args, cb) {
        let cmd = this.commandWrapper.command.split(' ',2)[1];
        if(cmd.startsWith('0x')){
            cmd = cmd.substring(2)
        }

        if(cmd.length <=0 || cmd.length/2 >32 || !(cmd.length % 2 === 0) || ! /^[0-9A-Fa-f]+$/g.test(cmd)){
            vorpal.log(c.red(`Error: Wrong input format! (uneven hex, not hexchars, 0 < ${cmd.length/2} < 32) input provided: '${cmd}'.`))
            //vorpal.execSync("help")
            return cb(false)
        } 


        let codeIncrement = [convertToHexString(0x60 + (cmd.length/2-1)), cmd]
        
        evm.runNext(codeIncrement).then(state => {
            vorpal.ui.imprint()
            vorpal.log('-------------------------------------------------------------')

            printState(state.lastState, (msg)=>{vorpal.log(msg)})
            cb(c.bold(c.yellow(state.lastState.returnValue.toString('hex'))))

            if(state.lastState.exceptionError){
                vorpal.log(c.bold(c.red(`⚠️  Revert: ${JSON.stringify(state.lastState.exceptionError)}`)))
                evm.reset()
            }
            return
        })
    })


/*
vorpal.exec(".load 0x3034526020600760203460045afa602034343e604034f3").then(
    vorpal.exec(".disasm")
)
*/