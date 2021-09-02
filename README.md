[<img width="200" alt="get in touch with Consensys Diligence" src="https://user-images.githubusercontent.com/2865694/56826101-91dcf380-685b-11e9-937c-af49c2510aa0.png">](https://diligence.consensys.net)<br/>
<sup>
[[  🌐  ](https://diligence.consensys.net)  [  📩  ](https://github.com/ConsenSys/vscode-solidity-doppelganger/blob/master/mailto:diligence@consensys.net)  [  🔥  ](https://consensys.github.io/diligence/)]
</sup><br/><br/>


## EVM Shell

An interactive EVM stack machine on your shell.

[💾](https://www.npmjs.com/package/evm-shell) `npm install evm-shell` (TBD)


```javascript
⇒  node --trace-warnings bin/main2.js
 
⇒  node --trace-warnings bin/main2.js
»  push 0x0a
»  
-------------------------------------------------------------
[pc      ]: 2
[code    ]: 0x600a
[gasUsed ]: 3
[stack   ]: ["0a"]
[memory  ]: {"type":"Buffer","data":[]}
[logs    ]: []
»  push 0x0a
»  
-------------------------------------------------------------
[pc      ]: 4
[code    ]: 0x600a600a
[gasUsed ]: 6
[stack   ]: ["0a","0a"]
[memory  ]: {"type":"Buffer","data":[]}
[logs    ]: []
»  gaslimit
»  
-------------------------------------------------------------
[pc      ]: 5
[code    ]: 0x600a600a45
[gasUsed ]: 8
[stack   ]: ["0a","0a","ffffffffffffff"]
[memory  ]: {"type":"Buffer","data":[]}
[logs    ]: []
»  pop
»  
-------------------------------------------------------------
[pc      ]: 6
[code    ]: 0x600a600a4550
[gasUsed ]: 10
[stack   ]: ["0a","0a"]
[memory  ]: {"type":"Buffer","data":[]}
[logs    ]: []
»  
```

### Usage

```shell
 »  help

  Commands:

    help [command...]         Provides help for a given command.
    exit                      Exits application.
    .reset                    
    .opcodes                  
    .step [step]              
    .stack                    
    .memory                   
    .state                    
    .logs                     
    .disasm                   
    .load <hexstr>            
    stop [args...]            
    add [args...]             
    mul [args...]             
    sub [args...]             
    div [args...]             
    sdiv [args...]            
    mod [args...]             
    smod [args...]            
    addmod [args...]          
    mulmod [args...]          
    exp [args...]             
    signextend [args...]      
    lt [args...]              
    gt [args...]              
    slt [args...]             
    sgt [args...]             
    eq [args...]              
    iszero [args...]          
    and [args...]             
    or [args...]              
    xor [args...]             
    not [args...]             
    byte [args...]            
    shl [args...]             
    shr [args...]             
    sar [args...]             
    sha3 [args...]            
    address [args...]         
    balance [args...]         
    origin [args...]          
    caller [args...]          
    callvalue [args...]       
    calldataload [args...]    
    calldatasize [args...]    
    calldatacopy [args...]    
    codesize [args...]        
    codecopy [args...]        
    gasprice [args...]        
    extcodesize [args...]     
    extcodecopy [args...]     
    returndatasize [args...]  
    returndatacopy [args...]  
    extcodehash [args...]     
    blockhash [args...]       
    coinbase [args...]        
    timestamp [args...]       
    number [args...]          
    difficulty [args...]      
    gaslimit [args...]        
    chainid [args...]         
    selfbalance [args...]     
    basefee [args...]         
    pop [args...]             
    mload [args...]           
    mstore [args...]          
    mstore8 [args...]         
    sload [args...]           
    sstore [args...]          
    jump [args...]            
    jumpi [args...]           
    pc [args...]              
    msize [args...]           
    gas [args...]             
    jumpdest [args...]        
    push1 [args...]           
    push2 [args...]           
    push3 [args...]           
    push4 [args...]           
    push5 [args...]           
    push6 [args...]           
    push7 [args...]           
    push8 [args...]           
    push9 [args...]           
    push10 [args...]          
    push11 [args...]          
    push12 [args...]          
    push13 [args...]          
    push14 [args...]          
    push15 [args...]          
    push16 [args...]          
    push17 [args...]          
    push18 [args...]          
    push19 [args...]          
    push20 [args...]          
    push21 [args...]          
    push22 [args...]          
    push23 [args...]          
    push24 [args...]          
    push25 [args...]          
    push26 [args...]          
    push27 [args...]          
    push28 [args...]          
    push29 [args...]          
    push30 [args...]          
    push31 [args...]          
    push32 [args...]          
    dup1 [args...]            
    dup2 [args...]            
    dup3 [args...]            
    dup4 [args...]            
    dup5 [args...]            
    dup6 [args...]            
    dup7 [args...]            
    dup8 [args...]            
    dup9 [args...]            
    dup10 [args...]           
    dup11 [args...]           
    dup12 [args...]           
    dup13 [args...]           
    dup14 [args...]           
    dup15 [args...]           
    dup16 [args...]           
    swap1 [args...]           
    swap2 [args...]           
    swap3 [args...]           
    swap4 [args...]           
    swap5 [args...]           
    swap6 [args...]           
    swap7 [args...]           
    swap8 [args...]           
    swap9 [args...]           
    swap10 [args...]          
    swap11 [args...]          
    swap12 [args...]          
    swap13 [args...]          
    swap14 [args...]          
    swap15 [args...]          
    swap16 [args...]          
    log0 [args...]            
    log1 [args...]            
    log2 [args...]            
    log3 [args...]            
    log4 [args...]            
    create [args...]          
    call [args...]            
    callcode [args...]        
    return [args...]          
    delegatecall [args...]    
    create2 [args...]         
    staticcall [args...]      
    revert [args...]          
    invalid [args...]         
    selfdestruct [args...]    
    push <args>    
```


