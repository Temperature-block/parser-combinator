// commomn type for parsers and different types for combinators

//import { match } from "assert";


export type inputstr = {
    src:string;
    curpo:number;
    maxlen:number;
};

export type suc_fail = {
    status : "sucess"|"failure";
    scanned:string|string[]|[];
    fatal_err?:string;
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
        maxlen:a.length

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
                scanned : m[0]
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

export function Pstring(chr: string){
    return function(match: inputstr){        
        var position = match.curpo;
        //console.log(position);
        var string_tom = (match.src).slice(position)
        //console.log(position);
        if((match.src)[position] == chr){
            //console.log("sucess")
            update(match,position+chr.length);
            const obj: suc_fail = {
                status : "sucess",
                scanned : chr
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

export function and(parser0:parser,parser1:parser){
        return function(match: inputstr){
            //console.log(parser0,parser1);       
            //console.log(res1);     
            var res0:suc_fail = parser0(match);
            var res1:suc_fail = parser1(match);
            //console.log(res0,res1);
            if(res0.status == "sucess" && res1.status == "sucess"){
                const obj: suc_fail = {
                    status : "sucess",
                    scanned : [res0.scanned,res1.scanned]
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

export function or(parser0:parser,parser1:parser){
            return function(match: inputstr){
                //console.log("call")
                var res0:suc_fail = parser0(match);
               //console.log(res0,res1)
                if(res0.status == "sucess"){
                    const obj: suc_fail = {
                        status : "sucess",
                        scanned : res0.scanned
                    };
                    //console.log(obj);
                    return obj;    
                }
                var res1:suc_fail = parser1(match);
                if(res1.status == "sucess"){
                    const obj: suc_fail = {
                        status : "sucess",
                        scanned : res1.scanned
                    };
                    //console.log(obj);
                    return obj;
                }
                else{
                    const obj: suc_fail = {
                        status : "failure",
                        scanned : [res0.scanned,res1.scanned]
                    };
                    //console.log(obj);
                    return obj;
                }
            }
         }

export function MZMT(parser0:parser){
        return function(match: inputstr){
            var arr:string[] = [];
            var cnt: number = -1;
            while(match.curpo<match.maxlen){
                //console.log("typeof res0");
                cnt = cnt + 1 ;
                var res0:suc_fail = parser0(match);
                //console.log(cnt)
                if(res0.status == "sucess"){ 
                    //console.log(res0);
                    arr.push(res0.scanned);
                    continue;
                }
                else{
                    //console.log(match.curpo)
                    if (cnt >= 0){
                    //.log("jjj")
                    const obj: suc_fail = {
                        status : "sucess",
                        scanned : arr
                    };
                    return obj;}
                    else{
                        //console.log("jj")
                        const obj: suc_fail = {
                            status : "sucess",
                            scanned : []
                        };
                        return obj;

                    }
                }
            }
            //console.log(arr)
            const obj: suc_fail = {
                status : "sucess",
                scanned : arr
            };
            return obj;
        }
    }

export function M1MT(parser0:parser){
        return function(match: inputstr){
            var stat = -1
            var arr:string[] = [];
            var cnt: number = -1;
            while(match.curpo<match.maxlen){
                cnt = cnt + 1 ;
                var res0:suc_fail = parser0(match);
                if(res0.status == "sucess"){ 
                    arr.push(res0.scanned);
                }
                else{
                    if (cnt > 0){
                    const obj: suc_fail = {
                        status : "sucess",
                        scanned : arr
                    };
                    return obj;}
                    else{
                        const obj: suc_fail = {
                            status : "sucess",
                            scanned : arr
                        };
                        return obj;
                    }
                }
            }
            if(cnt >=0){
            const obj: suc_fail = {
                status : "sucess",
                scanned : arr
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

export function muor(parser0:parser[]){
        return function(match: inputstr){
            for(var i =0;i<parser0.length;i++){
                var res0:suc_fail = parser0[i](match);
                if(res0.status == "sucess"){
                    const obj: suc_fail = {
                        status : "sucess",
                        scanned : res0.scanned
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
            //console.log(obj)
            return obj;    

        }
}

export function mand(parser0:parser[]){
        return function(match: inputstr){
            var arr:string[] = [];
            //console.log(parser0)
            for(var i =0;i<parser0.length;i++){
                var res0:suc_fail = parser0[i](match);
                if(res0.status == "sucess"){
                   // console.log(res0)
                    arr.push(res0.scanned);
                }
                else{
                    //console.log(res0)
                    const obj: suc_fail = {
                        status : "failure",
                        scanned : res0.scanned
                    };
                    //console.log(match)
                    return obj;
                }
            }
            const obj: suc_fail = {
                status : "sucess",
                scanned : arr
            };
            return obj;  
    }
}

//aka monster function
export function PconstructK(parser0){
    //console.log(parser0)
    var recur_f = function(match: inputstr){
        if(match.curpo == match.maxlen){
            const obj: suc_fail = {
                status : "failure",
                scanned : [],
                fatal_err : "EOF"
            };
            return obj;
        }
        let bb = [];
        for(var i = 0;i<parser0.length;i++){
            if(match.curpo == match.maxlen){
                break;
            }
            var s_0 = [];
            for(var j = 0;j<parser0[i].length;j++){
                //console.log(parser0[i])
                var typspf = typeof(parser0[i][j]);
                if(typspf == "function"){
                    if(match.curpo == match.maxlen){
                        const obj: suc_fail = {
                            status : "failure",
                            scanned : [],
                            fatal_err : "EOF"
                        };
                        return obj;
                    }
                    var temp = parser0[i][j](match);
                    //console.log(temp)
                    if(temp.status == "failure"){
                        if(j>0){
                            const obj: suc_fail = {
                                status : "failure",
                                scanned : []
                            };
                            return obj;
                        }
                        if(i == parser0.length-1){
                            const obj: suc_fail = {
                                status : "failure",
                                scanned : []
                            };
                            return obj;
                            //break;
                        }
                        else{
                            //s_0.push([]);
                            break;    
                        }
                    }
                    else{
                        s_0.push(temp.scanned);
                       //console.log(s_0)
                    
                    }

                }
                else if(typspf == "string"){
                   // console.log("recur")
                    if(match.curpo == match.maxlen){
                        const obj: suc_fail = {
                            status : "failure",
                            scanned : [],
                            fatal_err : "EOF"
                        };
                        return obj;
                    }
                    var recur;
                    while(1){
                        recur = recur_f(match);
                        if(recur.status == "failure"){
                            break;
                        }
                        else{
                            s_0.push(recur.scanned);
                        }
                    }
                    if(recur.status == "failure"){

                        if(recur.fatal_err=="EOF"){recur
                            if(j == parser0[i].length-1){
                                //s_0.push([]);
                                
                                break;
                            }
                            else{
                                const obj: suc_fail = {
                                    status : "failure",
                                    scanned : s_0,
                                    fatal_err : "EOF"
                                };
                                return obj;
                            }
                        }
                        else{
                            //s_0.push([]);
                            
                            continue;
                        }
                    }
                    else{
                        continue;
                    }
               
                
                }
               /* else if(typspf == "object"){
                    for(var k = 0;k<parser0[i][j].length;k++){
                        var t = typeof(parser0[i][j][k]);
                        if(t == "function"){
                        }
                    }
                }*/                
            }
            if(s_0.length == 0){
                //console.log("s_0")
                continue;
            }
            else{
            bb.push(s_0);
            break;
            }
        }
       // console.log(s_0)
        if(bb.length == 0){
            const obj: suc_fail = {
                status : "failure",
                scanned : bb
                
            };
        }
        else{
        const obj: suc_fail = {
            status : "sucess",
            scanned : bb
            
        };
        return obj;}
    
   }
   return recur_f;
}



/*
 do{
                    var recur = recur_f(match);
                    //console.log("recur",recur);
                    
                    if(recur.status == "failure"){

                        if(recur.fatal_err=="EOF"){recur
                            if(j == parser0[i].length-1){
                                s_0.push([]);
                                
                                break;
                            }
                            else{
                                const obj: suc_fail = {
                                    status : "failure",
                                    scanned : s_0,
                                    fatal_err : "EOF"
                                };
                                return obj;
                            }
                        }
                        else{
                            s_0.push([]);
                            
                            continue;
                        }
                    }
                    else{
                        //console.log(recur)
                        s_0.push(temp.scanned);

                    }}while(recur.status!="failure")
                        
                        if(j>0){
                            const obj: suc_fail = {
                                status : "failure",
                                scanned : [],
                            };
                            return obj;
                        }
                        if(i == parser0.length-1){
                            const obj: suc_fail = {
                                status : "failure",
                                scanned : []
                            };
                            return obj;
                            break;
                        }
                        else{
                            s_0.push([]);
                            break;    
                        }
    var stat1 = structuredClone(anyarr);
    var recur_f = function(match: inputstr){
        if(parser0.length != loca.length){
            const obj: suc_fail = {
                status : "failure",
                scanned : []
            };
            return obj;
        }
        var soln_st:string[] = [];
        for(var i = 0;i<parser0.length;i++){
            var soln_set:string[] = [];
            var stat = 0;
            for(var j = 0;j<parser0[i].length;j++){
                if(j == 0 && loca[i][j] == 1){
                    
                        const obj: suc_fail = {
                            status : "failure",
                            scanned : []
                        };
                        return obj;
                
            }
                if(loca[i][j] == 1){
                   var f = recur_f(match);
                   if(f.status == "sucess"){
                    soln_set.push(f.scanned);
                   }
                   else{
                    soln_set.push([]);
                    continue;
                   }
                }
                else{
                    var f = loca[i][j](match);
                    if(f.status == "sucess"){
                        }
                        if(i == parser0.length-1){
                            const obj: suc_fail = {
                                status : "failure",
                                scanned : []
                            };
                        stat = -1;
                        break;
                    }                       
                }
            }
            if(stat == -1 && handel == 0){
                match.
                soln_st = [...soln_set];
            }
            else{
                soln_st = [...soln_set];
            }
            
        }
}

export function Pchar(chr: string){
if(chr.length>1){
    throw new Error("please provide string of length 1");
}
return function(match: string){
    if(match == chr){
        return 0;
    }
    else{
        return 1;
    }
}
}

export function Pstring(chr: string){
    return function(match: string){
        if(match == chr){
            return 0;
        }
        else{
            return 1;
        }
    }
    }
export function recur_s(parser0:parser[],pos:number[]){    //pos [a, b ,c] a is presence of recursion status b is position 
        if(pos.length == 0){
            console.error("deliberate left recurstions are illegal")
        }

        var recf = function(){
            var arr:string[];
            for(var i =0;i<parser0.length;i++){
                
            }
        }
    }
    */