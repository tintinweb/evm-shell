'use strict'
/**
 * @author github.com/tintinweb
 * @license MIT
 * */
/** IMPORT */

const Common = require('@ethereumjs/common').default
const { Chain, Hardfork } = require('@ethereumjs/common')
const VM = require('@ethereumjs/vm').default
const { Address, BN } =  require('ethereumjs-util');

const {convertToHexString, chunkStr} = require('./utils');



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
                hardfork: Hardfork.London,
                caller:  "0xBabe00000000000000000000000000000000Babe",
                origin:  "0xBabe00000000000000000000000000000000Babe",
                address: "0xC0de00000000000000000000000000000000C0de",
                value: new BN(100),
                gasLimit: new BN(0xfffffffff),
                gasPrice: new BN(0x0),
                pc: 0
            }, ...(settings || {})
        }

        this.settings.address = Address.fromString(this.settings.address)
        this.settings.origin = Address.fromString(this.settings.origin)
        this.settings.caller = Address.fromString(this.settings.caller)

        this.reset()
    }

    reset(options) {
        options = options || {}
        let common = new Common(this.settings)
        this.common = common
        this.vm = new VM({ common })
        this.opcodes = this.vm.getActiveOpcodes()
        this.opcodeNames = this._getOpcodeNameMap()

        if(!options.preserveFieldsForUndo){
            this.lastState = undefined;
            this.codeHistory = [];
        }

        this.steps = [];
        
        this.vm.on('step', (data) => {
            this.steps.push(new State(data))
        })
    }

    undo() {
        return new Promise((resolve, reject) => {
            this.steps.pop() //pop last step
            this.lastState = this.steps[this.steps.length -1] //last step is lastState
            this.codeHistory.pop()  //pop last codefragment and replay the rest

            if(!this.lastState){ //no more states, return
                return resolve()
            }

            let codeToRun = this.codeHistory[this.codeHistory.length -1]
            this.reset({preserveFieldsForUndo: true})

            if(codeToRun){
                this.run(codeToRun) //replay state for last successful code
                .then(res => resolve(this))
                .catch(err => reject(err))
            } else {
                resolve(this)
            }
        });
    }

    _getOpcodeNameMap() {
        let names = new Map()
        for (let opcode of this.opcodes.values()) {
            names.set(opcode.fullName.toLowerCase(), opcode)
        }
        return names
    }

    run(code, data, isStatic) {
        var that = this;
        this.codeHistory.push(code)
        return new Promise((resolve, reject) => {

            this.vm.runCode({...this.settings, ...{
                code: Buffer.from(code.join(''), 'hex'),
                data: data,
                isStatic: isStatic
            }})
            .then((results) => {
                that.lastState = results;
                if(results.exceptionError){
                    return reject(results.exceptionError)
                }
                
                return resolve(that) // returns .steps, .result
            })
            .catch(err => {
                console.error(err)
                console.error("ERRR 😬")
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
        this.reset({preserveFieldsForUndo: true})
        return this.run(nextCode)
    }

    toString(state, chalk) {
        state = state || this.lastState;
        chalk = chalk || function(t){return t}
        return `[pc      ]: ${state.runState.programCounter}
[code    ]: 0x${chunkStr(state.runState.code.toString('hex'),64,[]).join("\n            ")}
[gasUsed ]: ${state.gasUsed}
[stack   ]: ${JSON.stringify(state.runState.stack._store)} ↗
[memory  ]: ${chunkStr(state.runState.memory._store.toString("hex"),64,[]).join("\n            ")} ↗
[storage ]: ${JSON.stringify(state.runState.eei._state._originalStorageCache)}
[logs    ]: ${JSON.stringify(state.runState.logs)}
`
    }

}


module.exports = {
    EvmTrace
}