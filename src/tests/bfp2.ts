
import * as foo from '../parse_comb.ts';

var syntaxtree:any[]=[];
var src:string =">>>++[<++++++++[<[<++>-]>>[>>]+>>+[-[->>+<<<[<[<<]<+>]>[>[>>]]]<[>>[-]]>[>[-<<]>[<+<]]+<<]<[>+<-]>>-]<.[-]>>]"
console.log(src[44])
var GT:foo.parser = foo.Pstring('>');
var LT:foo.parser = foo.Pstring('<');
var PLUS:foo.parser = foo.Pstring('+');
var MINUS:foo.parser = foo.Pstring('-');
var DOT:foo.parser = foo.Pstring('.');
var COMMA:foo.parser = foo.Pstring(',');
var LPAREN:foo.parser = foo.Pstring('[');
var RPAREN:foo.parser = foo.Pstring(']');
var op_code:foo.parser = foo.muor([GT,LT,PLUS,MINUS,DOT,COMMA]);
var statement:foo.parser = op_code;
statement = foo.or(op_code,foo.mand([LPAREN,foo.MZMT(statement),RPAREN]));
statement = foo.or(op_code,foo.mand([LPAREN,foo.MZMT(statement),RPAREN]));
statement = foo.or(op_code,foo.mand([LPAREN,foo.MZMT(statement),RPAREN]));
statement = foo.or(op_code,foo.mand([LPAREN,foo.MZMT(statement),RPAREN]));


var z = foo.and(op_code,foo.M1MT(GT));
function parser(){
   var ini:foo.inputstr=foo.init(src);
   while(ini.curpo < src.length){
       var res:foo.suc_fail=statement(ini);
       //console.log(res)
       if(res.status == "failure"){
           console.log("error",res.scanned,ini.curpo);
           Deno.exit(1);
           ini.curpo = ini.curpo + 1;
           continue;
       }
       else{
        syntaxtree.push(res.scanned)
       // console.log("suc",res);
       }
   }
   console.log(JSON.stringify(syntaxtree.flat()));
}
parser();
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


