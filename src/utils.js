/**
 * @author github.com/tintinweb
 * @license MIT
 * */


const {TerminalUi} = require('./terminalUi');


function printState(state, cb, evm) {
    cb(`[pc      ]: ${state.runState.programCounter}`)
    cb(`[code    ]: 0x${state.runState.code.toString('hex')}`)
    cb(`[gasUsed ]: ${state.gasUsed}`)
    cb(`[stack   ]: ${JSON.stringify(state.runState.stack._store)}`)
    cb(`[memory  ]: ${JSON.stringify(state.runState.memory._store.toString("hex"))}`)
    cb(`[storage ]: ${JSON.stringify(state.runState.eei._state._originalStorageCache)}`)
    cb(`[logs    ]: ${JSON.stringify(state.runState.logs)}`)
    return 


    const ui = new TerminalUi()
    ui.setInfo(`${"".padEnd(76)} 
 pc      : ${state.runState.programCounter}
 code    : 0x${chunkStr(state.runState.code.toString('hex'),64,[]).join("\n           ")}
 gasUsed : ${state.gasUsed}
    `)
    ui.setStack(`
${state.runState.stack._store.reverse().map(e => ` 0x${e.toString("hex")} `).join("\n")}
`)

    ui.setMemory(`
 ${state.runState.memory._store.toString("hex")}
    `)
    ui.setStorage(`
 ${JSON.stringify(state.runState.eei._state._originalStorageCache)}
`)
    ui.setLogs(`
 ${JSON.stringify(state.runState.logs.join("\n"))}        
`)

    ui.setDisasm(
        evm.steps.map(e => `${e.data.pc.toString().padStart(6)} - ${e.data.opcode.name}`).join('\n')
    )
    
    console.log(ui.render())

}

function convertToHexString(d) {
    let ret = Number(d)
    if (isNaN(ret)) {
        throw new Error("Invalid input value!")
    }
    let hexStr = ret.toString(16)
    return hexStr.padStart(hexStr.length + hexStr.length % 2, '0')
}


function convert(str) {
    switch (str) {
        case '': return undefined;
        case 'true': return true;
        case 'false': return false;
    }
    try {
        return parseInt(str);
    } catch { }

    return str;
}

function multilineInput(command) {
    while (true) {

        let numBrOpen = command.split('{').length - 1;
        let numBrClose = command.split('}').length - 1;

        if (numBrOpen === numBrClose) {
            break;
        }

        const rl = require('readline-sync');
        command += '\n' + rl.question("multi> ").trim()
    }
    return command;
}

const chunkStr = (str, n, acc) => {     
    if (str.length === 0) {
        return acc
    } else {
        acc.push(str.substring(0, n));
        return chunkStr(str.substring(n), n, acc);
    }
}

module.exports = {
    convert,
    multilineInput,
    printState,
    convertToHexString,
    chunkStr
}