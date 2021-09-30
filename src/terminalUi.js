#!/usr/bin/env node
'use strict'
/**
 * @author github.com/tintinweb
 * @license MIT
 * */


const boxen = require("boxen");

function mergeBoxes(inputBoxes) {
    let boxes = inputBoxes.map(b => b.split('\n'))
    let maxRows = Math.max(...boxes.map(b => b.length))
    let maxCols = boxes.map(b => Math.max(...b.map(bline => bline.length)))

    let mergeResult = []
    for (let i = 0; i < maxRows; i++) {
        let line = []
        for (let boxid in boxes) {
            let col = boxes[boxid][i] || ""
            line.push(col.padEnd(maxCols[boxid]))
        }
        mergeResult.push(line.join(""))
    }
    return mergeResult.join("\n")
}


class TerminalUi {
    constructor(){
        this.info = ""
        this.stack = ""
        this.memory = ""
        this.storage = ""
        this.logs = ""
    }

    setInfo(d){
        this.info = d
    }
    setStack(d){
        this.stack = d
    }
    setMemory(d){
        this.memory = d
    }
    setStorage(d){
        this.storage = d
    }
    setLogs(d){
        this.logs = d
    }
    setDisasm(d){
        this.disasm = d
    }

    render() {
        //build screen / draw boxen
        // line1 info - stack - memory - storage
        // line2 logs?
        let rows = [
            mergeBoxes([
                boxen(this.info, { float: 'left', title: "Info" }), 
                boxen(this.logs, { float: 'left', title: "Logs" }),

                
            ]),
            mergeBoxes([
                boxen(this.disasm,{ float: 'left', title: "Disasm",padding:1 }),
                boxen(this.stack,{ float: 'left', title: "Stack" }),
                boxen(this.memory, { float: 'left', title: "Memory" }), 
                boxen(this.storage, { float: 'left', title: "Storage" })
            ]),
            mergeBoxes([
                
            ])
        ]
        return rows.reduce((p, current) => `${p}\n${current}`);
    }


}

module.exports = {
    TerminalUi
}