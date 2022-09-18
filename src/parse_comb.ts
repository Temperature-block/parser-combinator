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
};


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
            const obj: suc_fail = {
                status : "sucess",
                scanned : arr
            };
            return obj;

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
            var arr:string[];
            for(var i =0;i<parser0.length;i++){
                var res0:suc_fail = parser0[i](match);
                if(res0.status == "sucess"){
                    arr.push(res0.scanned);
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
                scanned : arr
            };
            return obj;  
    }
}




/*
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