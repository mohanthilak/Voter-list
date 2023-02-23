const Client = require('@veryfi/veryfi-sdk');
const client_id = 'vrfmpGTaunAKXUytacdhSwJHUp5Ppj5uvnVpT6Z';
const client_secret = 'tPfCIwz0KhmUydabtym5e8U68PtzMmMEgO0RC0a9063oNSgxkocrHHe3gJAwewKHUPcv5vnvdhU5mP57cLD3wv11UilVGv67My22K2oGNbBgxJWgz78P54BRtSDhEo4A';
const username = 'mohan.thilak21';
const api_key = '883a517ae06c25cee1872155e3644629';

const categories = ['Grocery', 'Utilities', 'Travel'];
const file_path = './lib/images/3.png';


let veryfi_client = new Client(client_id, client_secret, username, api_key);
let text  
(async ()=>{
    text =await GetText(file_path, categories);
})();

console.log("Text from OCR",text);
// let obj1 = {}
//     let obj2 = {}
//     let obj3 = {};
// let i=0;
// while(i<text){
    
//     if(text[i] === "\"" && text[i+1]==="t"){
//         console.log(text[i],text[i+1]);
//         i = skiptabs(text, i);
//     }
//     obj1.rollNumber = text.substring(i,i+11);
//     i = i+11;
//     if(text[i] === "\"" && text[i+1]==="t"){
//         console.log(text[i],text[i+1]);
//         i = skiptabs(text, i);
//     }
//     obj2.rollNumber = text.substring(i,i+11);
//     i = i+11;
//     if(text[i] === "\"" && text[i+1]==="t"){
//         console.log(text[i],text[i+1]);
//         i = skiptabs(text, i);
//     }
//     obj3.rollNumber = text.substring(i,i+11);
//     i = i+11;
//     break;
// }

// console.log(obj1, obj2, obj3);

function skiptabs(text, i){
    while(text[i] === "\t"){
        i++;
    }
    return i;
}

function getName(text, i){
    let name='';
    while(true){
        name +=text[i];
        i++;
        if(text[i]==='\t') break;
    }
    return {name, i}
}

async function GetText(file_path, categories){
    try {
         veryfi_client.process_document(file_path, categories).then(res=>{
            //  console.log("Inside func", res.ocr_text)
             text =res.ocr_text

            let i=0;
            text =text.trim()
            console.log(text)
            let arr = [];
            while(i<text.length){
                console.log("!!!!",text.substring(i, i+11), "length:", text.length)
                let obj1 = {}
                let obj2 = {}
                let obj3 = {};   

                let skip1 = false;
                let skip2 = false;
                let skip3 = false;

                // while(text[i] !== '/[a-zA-Z]/') i++;
                // while(text[i] === '[0-9]' || text[i] === '\t') i++;
                
                


                //Roll Number Section 

                //OBJECT-1
                console.log("text[i]:", text[i])
                i = skipUntillRollNumber(text, i);
                obj1.rollNumber = text.substring(i,i+10);
                i = i+10;

                i = skipUntillRollNumber(text, i);

                // if(text[i] === "\t"){
                //     i = skiptabs(text, i);
                // }

                //OBKECT-2
                obj2.rollNumber = text.substring(i,i+10);
                i = i+10;
            
                i = skipUntillRollNumber(text, i);

                //OBJECT-3
                obj3.rollNumber = text.substring(i,i+10);
                i = i+10;
                console.log(obj1, obj2, obj3)
                // DONE WITH ROLL NUMBER



                
                // printstring(text, i);
                // break;

                //NAME
                
                while(text[i] !== "N") i++;
                
                
                //OBJECT-1
                i+=6;
                let name = " "
                while(text[i] !== '\t'){
                    name += text[i];
                    i++;
                }
                obj1.Name = name;


                while(text[i] !== "N")i++;

                //OBJECT-2
                i+=6;
                name = " "
                while(text[i] !== '\t'){
                    name += text[i];
                    i++;
                } 
                obj2.Name = name;


                while(text[i] !== "N") i++;
                 
                //OBJECT-3
                i+=6;
                name = " "
                while(text[i] !== '\t'){
                    name += text[i];
                    i++;
                    if( text[i] === '\n') break;
                }
                obj3.Name = name;
                i++;
                console.log("111111111111111@!@!@!@!", text.substring(i, i+9))
                if(text[i] === "\t"){
                    while(text[i]==="\t") i++;
                    console.log("{}{}{{}{{}{{{", text.substring(i, i+6))
                    if(text.substring(i, i+7) === "DELETED") skip3 = true;
                    while(text[i]==="\t" || text[i]==="\n") i++;
                    console.log("skipping 3", text[i]);
                }
                console.log("222222222222",skip3)
                console.log(obj1, obj2, obj3)



                //FHName
                //OBJECT-1
                name = ''
                if(text[i]==="F"){
                    i += 15;
                    while(text[i]!=='\t'){
                        name += text[i];
                        i++;
                    }
                    obj1.FatherName = name;
                }else if(text[i]==="H"){
                    i += 16;
                    while(text[i] !=='\t'){
                        name += text[i];
                        i++;
                    }
                    obj1.HusbandName = name;
                }
                
                while(text[i] === '\t')i++;
                

                //OBJECT-2
                name = ''
                if(text[i]==="F"){
                    i += 15;
                    while(text[i]!=='\t'){
                        name += text[i];
                        i++;
                    }
                    obj2.FatherName = name;
                }else{
                    i += 16;
                    while(text[i] !=='\t'){
                        name += text[i];
                        i++;
                    }
                    obj2.HusbandName = name;
                }

                while(text[i] === '\t')i++;

                //OBJECT-3
                console.log("33333333333333333333",skip3)

                if(!skip3){
                    console.log("^^^^^^^^^^^^^^^^^^^^^1")

                    name = ''
                    if(text[i]==="F"){
                        i += 15;
                        while(text[i]!=='\n'){
                            name += text[i];
                            i++;
                        }
                        obj3.FatherName = name;
                    }else{
                        i += 16;
                        while(text[i] !=='\n'){
                            name += text[i];
                            i++;
                        }
                        obj3.HusbandName = name;
                    }
                    i++;
                }else{
                    while(text[i] !== "\n")i++;
                }
                console.log(obj1, obj2, obj3)
                
                
                
                //HOUSE NUMBER
                
                //OBJECT-1
                i+=14;
                let houseNumber=''
                while(text[i]!== '\t'){
                    houseNumber += text[i];
                    i++;
                }
                obj1.HouseNumber =  houseNumber;
                
                //OBJECT-2
                while(text[i]!== "H") i++;
                i+=14;
                houseNumber=""
                while(text[i]!== '\t'){
                    houseNumber += text[i];
                    i++;
                }
                obj2.HouseNumber= houseNumber;
                
                //OBJECT-3
                if(!skip3){
                    console.log("^^^^^^^^^^^^^^^^^^^^^2")

                    while(text[i]!== '\t') i++;
                    if(text)
                    i+=14;
                    houseNumber=""
                    while(text[i]!== '\n'){
                        houseNumber += text[i];
                        i++;
                    }
                    obj3.HouseNumber = houseNumber;
                }else while(text[i]!=='\n') i++;
                console.log(obj1, obj2, obj3)



                //AGE & GENDER 

                //OBJECT-1
                i+=6;
                let age ='';
                while(text[i]!==" "){
                    age+=text[i];
                    i++;
                }
                obj1.Age = age;
                i++;
                i+=8;
                if(text[i] === 'F'){
                    obj1.Gender ="Female";
                    i+=4
                } 
                else obj1.Gender = 'Male';
                i+=3;
                

                //OBJECT-2
                while(text[i] !== 'A'){
                    i++;
                } 
                i+=5;
                age ='';
                while(text[i]!==" "){
                    age+=text[i];
                    i++;
                }
                obj2.Age = age;
                i++;
                i+=8;
                if(text[i] === 'F'){
                    obj2.Gender ="Female";
                    i+=4;
                } 
                else {
                    obj2.Gender = 'Male';
                    i+=3;
                }


                //OBJECT-3
                if(!skip3){
                    console.log("^^^^^^^^^^^^^^^^^^^^^3")
                    while(text[i] !== 'A') i++;
                    i+=5;
                    age ='';
                    while(text[i]!==" "){
                        age+=text[i];
                        i++;
                    }
                    obj3.Age = age;
                    i++;
                    i+=8;
                    if(text[i] === 'F') obj3.Gender ="Female";
                    else obj3.Gender = 'Male';
                }
                console.log(obj1, obj2, obj3)

                while(text[i]!== '\n') i++;
                i++;
                console.log("hahahah1", text.substring(i, i+20))
                if(text.substring(i, i+9) === "Available")i+=9

                while(text[i] == '\t' || text[i] === '\n') i++;
                console.log("hahahah2", text.substring(i, i+20))

                if(text.substring(i, i+9) === "Available")i+=9
                while(text[i] == '\t' || text[i] === '\n') i++;
                console.log("hahahah3", text.substring(i, i+20))

                if(text.substring(i, i+9) === "Available")i+=9
                while(text[i] == '\t' || text[i] === '\n') i++;
                console.log("hahahah3", text.substring(i, i+20))

                if(text.substring(i, i+9) === "Available")i+=9
                while(text[i] == '\t' || text[i] === '\n') i++;
                console.log("hahahah4", text.substring(i, i+20))

                // console.log("age shoyld be:", text[i], i)
                console.log(obj1, obj2, obj3)
                arr.push(obj1)
                arr.push(obj2)
                arr.push(obj3)
                // console.log(obj1, obj2, obj3, i);
            }                       

            console.log(arr)
            // return res.ocr_text
         })
        // return result.ocr_text;
    } catch (error) {
        console.log("error while API fetch", error);
    }
}


function skipUntillRollNumber(text, i){
    while(text[i] === "\t") i++;
    while(text[i] >= '0' && text[i]<= '9')i++;
    while(text[i] === "\t") i++;
    while(text[i] === '\n') i++;
    while(text[i] === "\t") i++;
    return i;
}