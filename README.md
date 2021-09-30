[<img width="200" alt="get in touch with Consensys Diligence" src="https://user-images.githubusercontent.com/2865694/56826101-91dcf380-685b-11e9-937c-af49c2510aa0.png">](https://diligence.consensys.net)<br/>
<sup>
[[  🌐  ](https://diligence.consensys.net)  [  📩  ](https://github.com/ConsenSys/vscode-solidity-doppelganger/blob/master/mailto:diligence@consensys.net)  [  🔥  ](https://consensys.github.io/diligence/)]
</sup><br/><br/>


## EVM Shell

A hands-on interactive EVM repl/shell. Low-level ethereum virtual machine inspection.

[💾](https://www.npmjs.com/package/solidity-shell) `npm install -g evm-shell` 

In order to understand smart contracts you have to become a smart contract. `evm-shell` is your entrance to this rabbithole 🐰🕳️. 

Imagine, you wake up as a smart contract deployed at address `0xc0de00000000000000000000000000000000c0de`. Your friend at account `0xbabe00000000000000000000000000000000babe` is calling your contract code. You decide what to do, step-by-step, one [instruction](https://ethervm.io/) at a time. Perform arithmetic operations, manipulate the stack, memory, storage, emit events, and much more. Your code, your rules 👑.

```javascript
⇒  evm-shell
🚀 Entering interactive EVM shell. 'help' is your friend. '[Tab]' for autocomplete.
   → chainId:      1
   → hardfork:     london
   → address:      0xc0de00000000000000000000000000000000c0de
   → value:        100
   → gasLimit:     68719476735
   → gasPrice:     0
   → caller/origin:0xbabe00000000000000000000000000000000babe/0xbabe00000000000000000000000000000000babe

🙌 Bugs/Feedback → github/@tintinweb 
    → https://github.com/tintinweb/evm-shell/ | ConsenSys Diligence @ https://consensys.net/diligence/

»  push 1
»  
────────────────────────────────────────────────────────────────────────────
[pc      ]: 2
[code    ]: 0x6001
[gasUsed ]: 3
[stack   ]: ["01"] ↗
[memory  ]:  ↗
[storage ]: []
[logs    ]: []

»  push 0xfe
»  
────────────────────────────────────────────────────────────────────────────
[pc      ]: 4
[code    ]: 0x600160fe
[gasUsed ]: 6
[stack   ]: ["01","fe"] ↗
[memory  ]:  ↗
[storage ]: []
[logs    ]: []

»  mul
»  
────────────────────────────────────────────────────────────────────────────
[pc      ]: 5
[code    ]: 0x600160fe02
[gasUsed ]: 11
[stack   ]: ["fe"] ↗
[memory  ]:  ↗
[storage ]: []
[logs    ]: []

```

### Hints

* **Note**: This is **not a simulator**, we actually run your code in the amazing [ethereumjs](https://github.com/ethereumjs) vm.
* **Note**: `.reset` completely removes all statements. `.undo` removes the last statement.
* **Note**: Automatically restores the state if you mess up because your instruction reverts 😉

### Usage

Basically lists all supported evm instructions. Meta-commands are `dot`-prefixed.

```shell
 »  help

  Commands:

    help [command...]         Provides help for a given command.
    exit                      Exits application.
    .show                     
    .reset                    
    .undo                     
    .config                   
    .opcodes                  
    .step [step]              
    .stack                    
    .memory                   
    .state                    
    .storage                  
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

## Examples 


![solidity-shell](https://user-images.githubusercontent.com/2865694/131328119-e363f20a-f627-43fc-8801-8d6613ad740f.gif)


### Transaction vars: `msg.sender`, `tx.origin`, `this` etc.

```javascript
»  caller
»  
────────────────────────────────────────────────────────────────────────────
[pc      ]: 1
[code    ]: 0x33
[gasUsed ]: 2
[stack   ]: ["babe00000000000000000000000000000000babe"] ↗
[memory  ]:  ↗
[storage ]: []
[logs    ]: []

»  address
»  
────────────────────────────────────────────────────────────────────────────
[pc      ]: 1
[code    ]: 0x30
[gasUsed ]: 2
[stack   ]: ["c0de00000000000000000000000000000000c0de"] ↗
[memory  ]:  ↗
[storage ]: []
[logs    ]: []
```

### Memory manipulation

```javascript
»  push 0x1337
»  
────────────────────────────────────────────────────────────────────────────
[pc      ]: 3
[code    ]: 0x611337
[gasUsed ]: 3
[stack   ]: ["1337"] ↗
[memory  ]:  ↗
[storage ]: []
[logs    ]: []

»  push 64
»  
────────────────────────────────────────────────────────────────────────────
[pc      ]: 5
[code    ]: 0x6113376040
[gasUsed ]: 6
[stack   ]: ["1337","40"] ↗
[memory  ]:  ↗
[storage ]: []
[logs    ]: []

»  mstore
»  
────────────────────────────────────────────────────────────────────────────
[pc      ]: 6
[code    ]: 0x611337604052
[gasUsed ]: 18
[stack   ]: [] ↗
[memory  ]: 0000000000000000000000000000000000000000000000000000000000000000
            0000000000000000000000000000000000000000000000000000000000000000
            0000000000000000000000000000000000000000000000000000000000001337 ↗
[storage ]: []
[logs    ]: []

»  push 64
»  
────────────────────────────────────────────────────────────────────────────
[pc      ]: 8
[code    ]: 0x6113376040526040
[gasUsed ]: 21
[stack   ]: ["40"] ↗
[memory  ]: 0000000000000000000000000000000000000000000000000000000000000000
            0000000000000000000000000000000000000000000000000000000000000000
            0000000000000000000000000000000000000000000000000000000000001337 ↗
[storage ]: []
[logs    ]: []

»  mload
»  
────────────────────────────────────────────────────────────────────────────
[pc      ]: 9
[code    ]: 0x611337604052604051
[gasUsed ]: 24
[stack   ]: ["1337"] ↗
[memory  ]: 0000000000000000000000000000000000000000000000000000000000000000
            0000000000000000000000000000000000000000000000000000000000000000
            0000000000000000000000000000000000000000000000000000000000001337 ↗
[storage ]: []
[logs    ]: []
```

____
