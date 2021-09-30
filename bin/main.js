#!/usr/bin/env node
'use strict'
/**
 * @author github.com/tintinweb
 * @license MIT
 * */
const Vorpal = require('vorpal');
const c = require('chalk');

const { convertToHexString } = require('../src/utils');
const { EvmTrace } = require('../src/index');

var evm = new EvmTrace()

const vorpal = new Vorpal()
    .delimiter(c.bold('» '))
    .show()
    .parse(process.argv);


vorpal
    .command('.show')
    .alias('.print')
    .action((args, cb) => {
        if (!evm.lastState) {
            return cb();
        }
        vorpal.log(evm.toString())
        return cb();
    });


vorpal
    .command('.reset')
    .action((args, cb) => {
        evm.reset()
        return cb("💪   reset!");
    });

vorpal
    .command('.undo')
    .action((args, cb) => {
        return evm.undo().then(state => {
            vorpal.log(evm.toString(state.lastState))
            state===undefined ? cb() : cb(c.bold(c.yellow(state.lastState.returnValue.toString('hex'))))
            vorpal.log("💪   last instruction undone!");
        }).catch(cb)
    });

vorpal
    .command('.config')
    .action((args, cb) => {
        return cb(evm.settings);
    });

vorpal
    .command('.opcodes')
    .action((args, cb) => {
        return cb(evm.opcodeNames.keys());
    });

vorpal
    .command('.step [step]')
    .action((args, cb) => {
        let index = evm.steps.length - 1; //last by default
        if (args.step) {
            index = parseInt(args.step)
        }
        console.log(index)
        return cb(evm.steps[index]);
    });

vorpal
    .command('.stack')
    .action((args, cb) => {
        let index = evm.steps.length - 1; //last by default
        if (args.length > 0) {
            index = parseInt(args[0])
        }
        return cb(evm.steps[index].data.stack);
    });

vorpal
    .command('.memory')
    .alias('.mem')
    .action((args, cb) => {
        let index = evm.steps.length - 1; //last by default
        if (args.length > 0) {
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
    .command('.storage')
    .alias('.sto')
    .action((args, cb) => {
        return cb(evm.lastState.runState.eei._state._originalStorageCache)
    })

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
        let cmd = this.commandWrapper.command.split(' ', 2)[1];
        if (cmd.startsWith('0x')) {
            cmd = cmd.substring(2)
        }

        if (!(cmd.length % 2 === 0) || ! /^[0-9A-Fa-f]+$/g.test(cmd)) {
            vorpal.log(c.red(`Error: Uneven or Non-Hex input provided: '${cmd}'.`))
            //vorpal.execSync("help")
            return cb(false)
        }
        let code = [...Buffer.from(cmd, 'hex')].map(convertToHexString)


        evm.runNext(code)
            .then(state => {
                vorpal.ui.imprint()
                vorpal.log('Trace:\n')
                evm.steps.forEach(e => vorpal.log(`${e.data.pc.toString().padStart(6)} - ${e.data.opcode.name}`))
                vorpal.log('─'.repeat(76))
                vorpal.log(evm.toString(state.lastState))
                
                cb(c.bold(c.yellow(state.lastState.returnValue.toString('hex'))))
            })
            .catch(err => {
                vorpal.log(c.bold(c.red(`⚠️  Revert: ${JSON.stringify(err)}`)))
                evm.undo().then((state) => {
                    vorpal.log(evm.toString(state.lastState))
                    return cb();
                }).catch(err => cb(err))
            })
    });

for (let [mnemonic, opcode] of evm.opcodeNames.entries()) {
    vorpal
        .command(`${mnemonic} [args...]`)
        .validate((args) => {
            if (!args || !args.args) {
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

            evm.runNext(codeIncrement)
                .then(state => {
                    vorpal.ui.imprint()
                    vorpal.log('─'.repeat(76))

                    vorpal.log(evm.toString(state.lastState))
                    
                    cb(c.bold(c.yellow(state.lastState.returnValue.toString('hex'))))
                    return
                })
                .catch(err => {
                    vorpal.log(c.bold(c.red(`⚠️  Revert: ${JSON.stringify(err)}`)))
                    evm.undo().then((state) => {
                        vorpal.log(evm.toString(state.lastState))
                        return cb();
                    }).catch(err => cb(err))
                })
        })
}

/** wrapper for push that autodetects push1-32 */
vorpal
    .command(`push <args>`)
    .action(function (args, cb) {
        let cmd = this.commandWrapper.command.split(' ', 2)[1];

        if(cmd.startsWith("0x")){
            cmd = cmd.substring(2)
            cmd = cmd.padStart(cmd.length + cmd.length % 2, '0')
        } else {
            try {
                cmd = convertToHexString(cmd)
            } catch (e) {
                return cb(e)
            }
            
        }

        if (cmd.length <= 0 || cmd.length / 2 > 32 || !(cmd.length % 2 === 0) || ! /^[0-9A-Fa-f]+$/g.test(cmd)) {
            vorpal.log(c.red(`Error: Wrong input format! (uneven hex, not hexchars, 0 < len:${Math.floor(cmd.length / 2)} < 32) input provided: '${cmd}'.`))
            //vorpal.execSync("help")
            return cb(false)
        }

        let codeIncrement = [convertToHexString(0x60 + (cmd.length / 2 - 1)), cmd]

        evm.runNext(codeIncrement)
            .then(state => {
                vorpal.ui.imprint()
                vorpal.log('─'.repeat(76))
                vorpal.log(evm.toString(state.lastState))
                
                cb(c.bold(c.yellow(state.lastState.returnValue.toString('hex'))))
                return
            })
            .catch(err => {
                vorpal.log(c.bold(c.red(`⚠️  Revert: ${JSON.stringify(err)}`)))
                evm.undo().then((state) => {
                    vorpal.log(evm.toString(state.lastState))
                    return cb();
                }).catch(err => cb(err))
            })
    })

function main() {
    vorpal.log(`🚀 Entering interactive EVM shell. '${c.bold('help')}' is your friend. '${c.bold('[Tab]')}' for autocomplete.`);
    vorpal.log(`   ${c.yellow('→ chainId:      ')}${evm.settings.chain}`)
    vorpal.log(`   ${c.yellow('→ hardfork:     ')}${evm.settings.hardfork}`)
    vorpal.log(`   ${c.yellow('→ address:      ')}${evm.settings.address}`)
    vorpal.log(`   ${c.yellow('→ value:        ')}${evm.settings.value}`)
    vorpal.log(`   ${c.yellow('→ gasLimit:     ')}${evm.settings.gasLimit}`)
    vorpal.log(`   ${c.yellow('→ gasPrice:     ')}${evm.settings.gasPrice}`)
    vorpal.log(`   ${c.yellow('→ caller/origin:')}${evm.settings.caller}/${evm.settings.origin}`)

    vorpal.log(`
🙌 Bugs/Feedback → github/${c.bold('@tintinweb')} 
    → https://github.com/tintinweb/evm-shell/ | ConsenSys Diligence @ https://consensys.net/diligence/
`)
    
}
/* main */
main()

/*
vorpal.exec(".load 0x3034526020600760203460045afa602034343e604034f3").then(
    vorpal.exec(".disasm")
)
*/







