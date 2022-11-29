// commomn type for parsers and different types for combinators
//@ts-nocheck
//import { match } from "assert";
var track = -1;

export type inputstr = {
    src:string;
    curpo:number;
    maxlen:number;
};

export type suc_fail = {
    status : "sucess"|"failure";
    scanned:string|string[]|[];
    fatal_err?:string;
    acc?:any;
};
var anyarr:any[] = [];

export type parser = (inputstr:inputstr) => suc_fail;


export function update(targ: inputstr,numb:number){
    targ.curpo = numb;
}

export function init(a:string){
    var b:inputstr={
        src : a,
        curpo:0,
        maxlen:a.length,
    }
    return b;
}
export function anyADV(){
    return function(match: inputstr){                   
            update(match, match.curpo+1);
            const obj: suc_fail = {
                status : "sucess",
                scanned : []
            };
            return obj;
        }    
}
export function rematch(v:RegExp){
    return function(match: inputstr){  
            var strr = match.src.slice(match.curpo);   
            var m = strr.match(v);  
            if(m!==null){   
            update(match, m[0].length);
            const obj: suc_fail = {
                status : "sucess",
                scanned : m[0],
                acc : {
                    name:b,
                    val:chr
                }
            };
            return obj;}
            else{
                const obj: suc_fail = {
                    status : "failure",
                    scanned : []
                };
            }
        }    
}

export function Pstring(chr: string,b:any){
    return function(match: inputstr){        
        var position = match.curpo;
        //console.log(position);
        var string_tom = (match.src).slice(position)
        //console.log(position);
        //var string_tom = (match.src).slice(position)
        if((match.src).startsWith(chr,match.curpo) ){            //console.log("sucess")
            update(match,position+chr.length);
            const obj: suc_fail = {
                status : "sucess",
                scanned : chr,
                acc : {
                    name:b,
                    val:chr
                }
            };
            return obj;
        }
        else{
            const obj: suc_fail = {
                status : "failure",
                scanned : chr
            };
            return obj;
        }
    }
}

export function and(parser0:parser,parser1:parser,b:any){
        return function(match: inputstr){
            var res0:suc_fail = parser0(match);
            var res1:suc_fail = parser1(match);
            if(res0.status == "sucess" && res1.status == "sucess"){
                const obj: suc_fail = {
                    status : "sucess",
                    scanned : [res0.scanned,res1.scanned],
                    acc : {
                        name:b,
                        val:[res0.acc,res1.acc]
                    }
                };
                return obj;
            }
            else{
                const obj: suc_fail = {
                    status : "failure",
                    scanned : [res0.scanned,res1.scanned]
                };
                return obj;
            }
        }
    }

export function or(parser0:parser,parser1:parser,b?:any){
            return function(match: inputstr){
                var res0:suc_fail = parser0(match);
                if(res0.status == "sucess"){
                    const obj: suc_fail = {
                        status : "sucess",
                        scanned : res0.scanned,
                        acc : {
                            name:b,
                            val:res0.acc
                        }
                    };
                    return obj;    
                }
                var res1:suc_fail = parser1(match);
                if(res1.status == "sucess"){
                    const obj: suc_fail = {
                        status : "sucess",
                        scanned : res1.scanned,
                        acc : {
                            name:b,
                            val:res1.acc
                        }
                    };
                    return obj;
                }
                else{
                    const obj: suc_fail = {
                        status : "failure",
                        scanned : [res0.scanned,res1.scanned]
                    };
                    return obj;
                }
            }
         }

export function MZMT(parser0:parser,b?:any){
        return function(match: inputstr){
            var arr:string[] = [];
            var acarr = [];
            var cnt: number = -1;
            while(match.curpo<match.maxlen){
                cnt = cnt + 1 ;
                var res0:suc_fail = parser0(match);
                if(res0.status == "sucess"){ 
                    arr.push(res0.scanned);
                    acarr.push(res0.acc)
                    continue;
                }
                else{
                    if (cnt >= 0){
                    const obj: suc_fail = {
                        status : "sucess",
                        scanned : arr,
                        acc : {
                            name:b,
                            val:acarr
                        }
                    };
                    return obj;}
                    else{
                        const obj: suc_fail = {
                            status : "sucess",
                            scanned : [],
                            acc : {
                                name:b,
                                val:[]
                            }
                        };
                        return obj;

                    }
                }
            }
            const obj: suc_fail = {
                status : "sucess",
                scanned : arr,
                acc : {
                    name:b,
                    val:acarr
                }
            };
            return obj;
        }
    }

export function M1MT(parser0:parser,b?:any){
        return function(match: inputstr){
            var stat = -1
            var arr:string[] = [];
            var acarr = [];
            var cnt: number = -1;
            while(match.curpo<match.maxlen){
                cnt = cnt + 1 ;
                var res0:suc_fail = parser0(match);
                if(res0.status == "sucess"){ 
                    arr.push(res0.scanned);
                    acarr.push(res0.acc)
                }
                else{
                    if (cnt > 0){
                    const obj: suc_fail = {
                        status : "sucess",
                        scanned : arr,
                        acc : {
                            name:b,
                            val:acarr
                        }
                    };
                    return obj;}
                    else{
                        const obj: suc_fail = {
                            status : "failure",
                            scanned : arr
                        };
                        return obj;
                    }
                }
            }
            if(cnt >=0){
            const obj: suc_fail = {
                status : "sucess",
                scanned : arr,
                acc : {
                    name:b,
                    val:acarr
                }
            };
            return obj;}
            else{
                const obj: suc_fail = {
                    status : "failure",
                    scanned : arr
                };
                return obj                
            }

        }
}

export function muor(parser0:parser[],b?:any){
        return function(match: inputstr){
            for(var i =0;i<parser0.length;i++){
                var res0:suc_fail = parser0[i](match);
                if(res0.status == "sucess"){
                    const obj: suc_fail = {
                        status : "sucess",
                        scanned : res0.scanned,
                        acc : {
                            name:b,
                            val:res0.acc
                        }
                    };
                    return obj;    
                }
                else{
                    continue;
                }
            }
            const obj: suc_fail = {
                status : "failure",
                scanned : res0.scanned
            };
            return obj;    

        }
}

export function mand(parser0:parser[],b?:any){
        return function(match: inputstr){
            var arr:string[] = [];
            var acarr = [];
            for(var i =0;i<parser0.length;i++){
                var res0:suc_fail = parser0[i](match);
                if(res0.status == "sucess"){
                    arr.push(res0.scanned);
                    acarr.push(res0.acc)
                }
                else{
                    const obj: suc_fail = {
                        status : "failure",
                        scanned : res0.scanned
                    };
                    return obj;
                }
            }
            const obj: suc_fail = {
                status : "sucess",
                scanned : arr,
                acc : {
                    name:b,
                    val:acarr
                }
            };
            return obj;  
    }
}

//aka monster function's
export function Pconstruct(parser0,b?:any){
    var recur_f = function(match: inputstr){
        if(match.curpo == match.maxlen){
            const obj: suc_fail = {
                status : "failure",
                scanned : [],
                fatal_err : "EOF"
            };
            return obj;
        }
        var parse_struct =  [];
        var parse_defined = [];
        for(var i = 0;i<parser0.length;i++){
            if(match.curpo == match.maxlen){
                break;
            }
            var partial_struct = [];
            var partial_defined = [];
            for(var j = 0;j<parser0[i].length;j++){
                var typspf = typeof(parser0[i][j]);
                if(typspf == "function"){
                    if(match.curpo == match.maxlen){
                        const obj: suc_fail = {
                            status : "failure",
                            scanned : partial_struct,
                            fatal_err : "EOF"
                        };
                        return obj;
                    }
                    var temp = parser0[i][j](match);
                    if(temp.status == "failure"){
                        if(j>0){
                            const obj: suc_fail = {
                                status : "failure",
                                scanned : partial_struct
                            };
                            return obj;
                        }
                        if(i == parser0.length-1){
                            const obj: suc_fail = {
                                status : "failure",
                                scanned : partial_struct
                            };
                            return obj;
                        }
                        else{
                            break;    
                        }
                    }//
                    else{
                        partial_struct.push(temp.scanned);
                        partial_defined.push(temp.acc);
                    }
                }//endiffunction
                else if(typspf == "string"){
                    if(match.curpo == match.maxlen){
                        const obj: suc_fail = {
                            status : "failure",
                            scanned : partial_struct,
                            fatal_err : "EOF"
                        };
                        return obj;
                    }
                    var recur;
                    recur = recur_f(match);
                    if(recur.status == "failure"){
                        if(recur.fatal_err=="EOF"){
                                const obj: suc_fail = {
                                    status : "failure",
                                    scanned : partial_struct,
                                    fatal_err : "EOF"
                                };
                                return obj;
                        }
                        else{
                            if(i == parser0.length){
                            const obj: suc_fail = {
                                status : "failure",
                                scanned : partial_struct
                            };
                            return obj;
                        }
                        else{
                            break;
                        }
                    }
                    }
                    else{
                        partial_struct.push(recur.scanned);
                        partial_defined.push(recur.acc);
                        }
                }
            }
            if(partial_struct.length == 0){
                continue;
            }
            else{
                break;
            }
        }
        return {
            status : "sucess",
            scanned : partial_struct,
            acc:{
                name:b,
                val:partial_defined}
        }
    }
    return recur_f;
} 

export function PconstructP(parser0,b?:any){
    var recur_f = function(match: inputstr){
        if(match.curpo == match.maxlen){
            const obj: suc_fail = {
                status : "failure",
                scanned : [],
                fatal_err : "EOF"
            };
            return obj;
        }
        //var parse_struct =  [];
       // var parse_defined = [];
        for(var i = 0;i<parser0.length;i++){
            if(match.curpo == match.maxlen){
                break;
            }
            var partial_struct = [];
            var partial_defined = [];
            for(var j = 0;j<parser0[i].length;j++){
                var typspf = typeof(parser0[i][j]);
                if(typspf == "function"){
                    if(match.curpo == match.maxlen){
                        const obj: suc_fail = {
                            status : "failure",
                            scanned : partial_struct,
                            fatal_err : "EOF"
                        };
                        return obj;
                    }
                    var temp = parser0[i][j](match);
                    if(temp.status == "failure"){
                        if(j>0){
                            const obj: suc_fail = {
                                status : "failure",
                                scanned : partial_struct
                            };
                            return obj;
                        }
                        if(i == parser0.length-1){
                            //console.log("NO")
                            const obj: suc_fail = {
                                status : "failure",
                                scanned : partial_struct
                            };
                            return obj;
                        }
                        else{
                            break;    
                        }
                    }//
                    else{
                        //console.log(temp.scanned)
                        partial_struct.push(temp.scanned);
                        partial_defined.push(temp.acc);
                    }
                }//endiffunction
                else if(typspf == "string"){
                    //console.log(partial_struct)
                    if(match.curpo == match.maxlen){
                        const obj: suc_fail = {
                            status : "failure",
                            scanned : partial_struct,
                            fatal_err : "EOF"
                        };
                        return obj;
                    }
                    var recur;
                    var parse_struct =  [];
                    var parse_defined = [];
                    while(1){
                        recur = recur_f(match);
                        if(recur.status == "failure"){
                            break;
                        }
                        else{
                            //console.log(partial_struct)
                            parse_struct.push(recur.scanned);
                            parse_defined.push(recur.acc);
                        }
                    }
                    //partial_struct.push(parse_struct)
                    //console.log(partial_struct)                   //recur = recur_f(match);
                    if(recur.status == "failure"){
                        if(recur.fatal_err=="EOF"){
                                const obj: suc_fail = {
                                    status : "failure",
                                    scanned : partial_struct,
                                    fatal_err : "EOF"
                                };
                                return obj;
                        }
                        else{
                            if(i == parser0.length){
                            //console.log("EEEEEEEEEEEEEEEE")    
                            const obj: suc_fail = {
                                status : "failure",
                                scanned : partial_struct
                            };
                            return obj;
                        }
                        else{
                            break;
                        }
                    }
                    }
                   
                        partial_struct.push(parse_struct);
                        //console.log(parse_struct)
                        partial_defined.push(parse_defined);
                        //console.log(partial_struct)
                        parse_struct = [];
                        parse_defined = [];
                }
            }
            if(partial_struct.length == 0){
                continue;
            }
            else{
                break;
            }
        }
        //console.log(partial_struct)
        return {
            status : "sucess",
            scanned : partial_struct,
            acc:{
                name:b,
                val:partial_defined}
        }
    }
    return recur_f;
}

export function PconstructK(parser0,b?:any){
    var recur_f = function(match: inputstr){
        if(match.curpo == match.maxlen){
            const obj: suc_fail = {
                status : "failure",
                scanned : [],
                fatal_err : "EOF"
            };
            return obj;
        }
        //var parse_struct =  [];
       // var parse_defined = [];
        for(var i = 0;i<parser0.length;i++){
            if(match.curpo == match.maxlen){
                break;
            }
            var partial_struct = [];
            var partial_defined = [];
            for(var j = 0;j<parser0[i].length;j++){
                var typspf = typeof(parser0[i][j]);
                if(typspf == "function"){
                    if(match.curpo == match.maxlen){
                        const obj: suc_fail = {
                            status : "failure",
                            scanned : partial_struct,
                            fatal_err : "EOF"
                        };
                        return obj;
                    }
                    var temp = parser0[i][j](match);
                    if(temp.status == "failure"){
                        if(j>0){
                            const obj: suc_fail = {
                                status : "failure",
                                scanned : partial_struct
                            };
                            return obj;
                        }
                        if(i == parser0.length-1){
                            //console.log("NO")
                            const obj: suc_fail = {
                                status : "failure",
                                scanned : partial_struct
                            };
                            return obj;
                        }
                        else{
                            break;    
                        }
                    }//
                    else{
                        //console.log(temp.scanned)
                        partial_struct.push(temp.scanned);
                        partial_defined.push(temp.acc);
                    }
                }//endiffunction
                else if(typspf == "string"){
                    //console.log(partial_struct)
                    if(match.curpo == match.maxlen){
                        const obj: suc_fail = {
                            status : "failure",
                            scanned : partial_struct,
                            fatal_err : "EOF"
                        };
                        return obj;
                    }
                    var recur;
                    var parse_struct =  [];
                    var parse_defined = [];
                    while(1){
                        recur = recur_f(match);
                        if(recur.status == "failure"){
                            break;
                        }
                        else{
                            //console.log(partial_struct)
                            parse_struct.push(recur.scanned);
                            parse_defined.push(recur.acc);
                        }
                    }
                    //partial_struct.push(parse_struct)
                    //console.log(partial_struct)                   //recur = recur_f(match);
                    if(recur.status == "failure"){
                        if(recur.fatal_err=="EOF"){
                                const obj: suc_fail = {
                                    status : "failure",
                                    scanned : partial_struct,
                                    fatal_err : "EOF"
                                };
                                return obj;
                        }
                        else{
                            if(i == parser0.length){
                            //console.log("EEEEEEEEEEEEEEEE")    
                            const obj: suc_fail = {
                                status : "failure",
                                scanned : partial_struct
                            };
                            return obj;
                        }
                    }
                    }
                   
                        partial_struct.push(parse_struct);
                        //console.log(parse_struct)
                        partial_defined.push(parse_defined);
                        console.log(partial_struct)
                        parse_struct = [];
                        parse_defined = [];
                }
            }
            if(partial_struct.length == 0){
                continue;
            }
            else{
                break;
            }
        }
        //console.log(partial_struct)
        return {
            status : "sucess",
            scanned : partial_struct,
            acc:{
                name:b,
                val:partial_defined}
        }
    }
    return recur_f;
}
