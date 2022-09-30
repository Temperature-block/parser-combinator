import * as foo from '../parse_comb.ts';
/*
file_
   : statement* EOF
   ;

statement
: opcode
| LPAREN statement* RPAREN
;

(statement rewrite)
statement
: opcode
| LPAREN 
;

cont = : opcode
| statement* RPAREN
;

opcode
   : GT | LT | PLUS | MINUS | DOT | COMMA
   ;


GT
   : '>'
   ;


LT
   : '<'
   ;


PLUS
   : '+'
   ;


MINUS
   : '-'
   ;


DOT
   : '.'
   ;


COMMA
   : ','
   ;


LPAREN
   : '['
   ;


RPAREN
   : ']'
   ;


WS
   : . -> skip
   ;*/
var syntaxtree:any[]=[];
var src:string =">>>++[[+]]"

//console.log(src.length)
var GT:foo.parser = foo.Pstring('>');
var LT:foo.parser = foo.Pstring('<');
var PLUS:foo.parser = foo.Pstring('+');
var MINUS:foo.parser = foo.Pstring('-');
var DOT:foo.parser = foo.Pstring('.');
var COMMA:foo.parser = foo.Pstring(',');
var LPAREN:foo.parser = foo.Pstring('[');
var RPAREN:foo.parser = foo.Pstring(']');
var op_code:foo.parser = foo.muor([GT,LT,PLUS,MINUS,DOT,COMMA]);
var statement:foo.parser = foo.PconstructK([[LPAREN,"statement",RPAREN],[op_code]]);
var ini:foo.inputstr=foo.init(src);
while(ini.curpo < src.length){
   var res:foo.suc_fail=statement(ini);
   //console.log(res)
   if(res.status == "failure"){
       console.log("error",res,ini.curpo);
       ini.curpo = ini.curpo + 1;
       continue;
   }
   else{
    syntaxtree.push(res.scanned)
    //console.log("suc",res);
   }
}
console.log(JSON.stringify(syntaxtree.flat(1)))

/*
(statement rewrite)
statement
: opcode
| LPAREN 
;

cont = : opcode
| statement* RPAREN
;*/





/*
//var su:foo.parser = foo.MZMT(statement);
//var bs:foo.parser = foo.mand([LPAREN,su,RPAREN]);
var s:foo.parser = foo.MZMT(op_code);
var j:foo.parser = foo.mand([LPAREN,s,RPAREN]);
var k:foo.parser = foo.mand([LPAREN,s,RPAREN]);
//var statement:foo.parser = foo.or(op_code);*/
