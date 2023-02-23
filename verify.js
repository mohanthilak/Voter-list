const Client = require('@veryfi/veryfi-sdk');
const client_id = 'vrfmpGTaunAKXUytacdhSwJHUp5Ppj5uvnVpT6Z';
const client_secret = 'tPfCIwz0KhmUydabtym5e8U68PtzMmMEgO0RC0a9063oNSgxkocrHHe3gJAwewKHUPcv5vnvdhU5mP57cLD3wv11UilVGv67My22K2oGNbBgxJWgz78P54BRtSDhEo4A';
const username = 'mohan.thilak21';
const api_key = '883a517ae06c25cee1872155e3644629';

const categories = ['Grocery', 'Utilities', 'Travel'];
const file_path = './lib/images/10.png';


let veryfi_client = new Client(client_id, client_secret, username, api_key);
let text  
// (async ()=>{
//     console.log(file_path, categories)
//     text =await GetText(file_path, categories);
//     transformTextToList(text);

//     // console.log("Text from OCR",text);
// })();

// async function ConvertImage(path){
//     console.log("!!!!!!!",path);
//     text =await GetText(path, categories);
//     const list = transformTextToList(text);
//     return list;
// }

const ConvertImage = async (path) => {
    text = await GetText(path, categories);
    console.log(path, "\n", text);
    const list = transformTextToList(text);
    return list;
}
async function GetText(file_path, categories){
    try{
        const res = await veryfi_client.process_document(file_path, categories);
        return res.ocr_text
    }catch(e){
        console.log("error while getting text", e);
    }
}

function skipUntillRollNumber(text, i){
    // console.log("::::::::::::::::", text.substring(i, i+13))
    while(text[i] === '\n')i++
    while(text[i] === "\t") i++;
    while(text[i] >= '0' && text[i]<= '9')i++;
    while(text[i] === "\t") i++;
    // console.log("::::::::::::::::", text.substring(i, i+16))
    while(text[i] >= '0' && text[i]<= '9')i++;
    while(text[i] === "\t") i++;
    while(text[i] >= '0' && text[i]<= '9')i++;
    while(text[i] === "\t") i++;
    while(text[i] === '\n') i++;
    while(text[i] === "\t") i++;

    return i;
}




function transformTextToList(text){

    // console.log("Text before trimming", text);
    text = text.trim();
    // console.log("Text after trimming", text);
    let i=0
    let arr = [];
    while(i<text.length){
        let obj1 = {};
        let obj2 = {};
        let obj3 = {};
        let [skip1, skip2, skip3] = [false, false, false];

        
        // console.log("+++++++++++++++++++++++", text.substring(i, i+10))
        // <------------ ROLL NUMBER ------------>
        //OBJECT-1
        i = skipUntillRollNumber(text, i);
        obj1.rollNumber = text.substring(i, i+10);
        i+=10;
        
        //OBJECT-2
        i = skipUntillRollNumber(text, i);
        obj2.rollNumber = text.substring(i, i+10);
        i+=10;
        //OBJECT-3
        i = skipUntillRollNumber(text, i);
        obj3.rollNumber = text.substring(i, i+10);
        i+=10;
        // console.log(obj1, obj2, obj3)

        // <------------ ROLL NUMBER ------------>





        // <------------ NAME ------------>
        // OBJECT-1
        while(text[i]!=="N") i++;
        i+=6;
        let name = '';
        while(text[i] !== '\t'){
            name += text[i];
            i++;
            if(i>text.length)break;
        }
        obj1.name = name;
        // console.log(obj1, obj2, obj3)


        //OBJECT-2
        // while(text.substring(i, i+4) !== "Name" || text.substring(i, i+7) !== "DELETED") i++;
        // while(text.substring(i, i+4) !== "Name" ) i++;
        while(true){
            if(text.substring(i, i+2) === "Na") break;
            if(text.substring(i, i+2) === "DE") break;
            i++
        }
        if(text.substring(i, i+7) === "DELETED"){
            skip1 = true;
            while(text[i] !== "N")i++
        }
        i+=6;
        name = '';
        while(text[i] !== '\t'){
            name += text[i];
            i++
        }
        obj2.name = name;
        // console.log(obj1, obj2, obj3)


        //OBJECT-3
        // while(text.substring(i, i+4) !== "Name" || text.substring(i, i+7) !== "DELETED") i++;
        while(true){
            if(text.substring(i, i+2) === "Na") break;
            if(text.substring(i, i+2) === "DE") break;
            i++
        }
        if(text.substring(i, i+7) === "DELETED"){
            skip2 = true;
            while(text[i] !== "N")i++
        }
        i+=6;
        name = '';
        while( text[i] !== '\n'){
            name += text[i];
            i++
        }
        obj3.name = name;
        i++;

        if(text[i] === '\t'){
            while(text[i] === '\t') i++;
            if(text.substring(i, i+7) === "DELETED") skip3 = true;
            while(text[i] === '\t' || text[i] === '\n')i++;
        }
        // console.log(obj1, obj2, obj3)

        // <------------  NAME ------------>



        
        // <------------  HUSBAND-FATHER NAME -------->
        //OBJECT-1
        let Resultattribute = figureOutTheAttribute(text, i);
        // console.log(Resultattribute);
        if(Resultattribute.attribute === "DELETED") {
            while(text[i]!== '\n') i++;
            i++;
            Resultattribute = figureOutTheAttribute(text, i);
            // console.log(Resultattribute);
        }
        i = Resultattribute.i;
        if(Resultattribute.success){
            let operation = Resultattribute.attribute;
            switch(operation){
                case "name": {
                    obj1
                    break;
                }
                case "Father's Name":{
                    response = recordFatherName(text, i, obj1);
                    obj1 = response.obj;
                    i = response.i;
                    break;
                }
                case "Husband's Name": {
                    response = recordHusbandName(text, i, obj1);
                    obj1 = response.obj;
                    i = response.i;
                    break;
                }
                case "Wife's Name":{
                    response = recordWifeName(text, i, obj1);
                    obj1=response.obj;
                    i = response.i;
                    break;
                }
                case "House Number": {
                    response = recordHouseNumber(text, i, obj1)
                    obj1 = response.obj;
                    i = response.i
                    break;
                }
                case "Age": {
                    response = recordAgeAndGender(text, i, obj1);
                    i = response.i;
                    obj1 =response.obj;
                    break;
                }
            }
        }else{
            
            const attribute = Object.keys(obj1)[Object.keys(obj1).length-1];
            name = obj1[attribute];
            obj1[attribute] = name.concat(" ", Resultattribute.attribute);
        }
        // console.log(obj1, obj2, obj3)

        //OBJECT-2
        while(true){
            // console.log("ggggg",text.substring(i, i+10))
            if(text[i] === '\t')i++;
            else if(text[i] === '\n')i++;
            else break;
        }
        // console.log("gg",text[i])

        Resultattribute = figureOutTheAttribute(text, i);
        // console.log(Resultattribute);
        i = Resultattribute.i;
        if(Resultattribute.success){
            let operation = Resultattribute.attribute;
            switch(operation){
                case "name": {
                    obj2
                    break;
                }
                case "Father's Name":{
                    response = recordFatherName(text, i, obj2);
                    obj2 = response.obj;
                    i = response.i;
                    break;
                }
                case "Husband's Name": {
                    response = recordHusbandName(text, i, obj2);
                    obj2 = response.obj;
                    i = response.i;
                    break;
                }
                case "Wife's Name":{
                    response = recordWifeName(text, i, obj2);
                    obj2=response.obj;
                    i = response.i;
                    break;
                }
                case "House Number": {
                    response = recordHouseNumber(text, i, obj2)
                    obj2 = response.obj;
                    i = response.i
                    break;
                }
                case "Age": {
                    response = recordAgeAndGender(text, i, obj2);
                    i = response.i;
                    obj2 =response.obj;
                    break;
                }
            }
        }else{ 
            const attribute = Object.keys(obj2)[Object.keys(obj2).length-1];
            name = obj2[attribute];
            obj2[attribute] = name.concat(" ", Resultattribute.attribute);
        }
        // console.log(obj1, obj2, obj3)

        //OBJECT-3
        while(text[i] === '\t' || text[i] === '\n')i++;
        Resultattribute = figureOutTheAttribute(text, i);
        // console.log(Resultattribute);
        i = Resultattribute.i;
        if(skip3)while(text[i] !=='\n')i++
        else{

            if(Resultattribute.success){
                let operation = Resultattribute.attribute;
                switch(operation){
                case "name": {
                    obj3
                    break;
                }
                case "Father's Name":{
                    response = recordFatherName(text, i, obj3);
                    obj3 = response.obj;
                    i = response.i;
                    break;
                }
                case "Husband's Name": {
                    response = recordHusbandName(text, i, obj3);
                    obj3 = response.obj;
                    i = response.i;
                    break;
                }
                case "Wife's Name":{
                    response = recordWifeName(text, i, obj3);
                    obj3=response.obj;
                    i = response.i;
                    break;
                }
                case "House Number": {
                    response = recordHouseNumber(text, i, obj3)
                    obj3 = response.obj;
                    i = response.i
                    break;
                }
                case "Age": {
                    response = recordAgeAndGender(text, i, obj3);
                    i = response.i;
                    obj3 =response.obj;
                    break;
                }
            }
            }else{ 
                const attribute = Object.keys(obj3)[Object.keys(obj3).length-1];
                name = obj3[attribute];
                obj3[attribute] = name.concat(" ", Resultattribute.attribute);
            }
        }
        // console.log(obj1, obj2, obj3)
        // <------------  HUSBAND-FATHER NAME -------->


        // <------------  HOUSE NUMBER -------->
        //OBJECT-1
        while(text[i] === '\t' || text[i] === '\n')i++;
        Resultattribute = figureOutTheAttribute(text, i);
        // console.log(Resultattribute);
        i = Resultattribute.i;
        if(Resultattribute.success){
            let operation = Resultattribute.attribute;
            switch(operation){
                case "name": {
                    obj1
                    break;
                }
                case "Father's Name":{
                    response = recordFatherName(text, i, obj1);
                    obj1 = response.obj;
                    i = response.i;
                    break;
                }
                case "Husband's Name": {
                    response = recordHusbandName(text, i, obj1);
                    obj1 = response.obj;
                    i = response.i;
                    break;
                }
                case "Wife's Name":{
                    response = recordWifeName(text, i, obj1);
                    obj1=response.obj;
                    i = response.i;
                    break;
                }
                case "House Number": {
                    response = recordHouseNumber(text, i, obj1)
                    obj1 = response.obj;
                    i = response.i
                    break;
                }
                case "Age": {
                    response = recordAgeAndGender(text, i, obj1);
                    i = response.i;
                    obj1 =response.obj;
                    break;
                }
            }
        }else{ 
            const attribute = Object.keys(obj1)[Object.keys(obj1).length-1];
            name = obj1[attribute];
            obj1[attribute] = name.concat(" ", Resultattribute.attribute);
        }

        //OBJECT-2
        while(text[i] === '\t' || text[i] === '\n')i++;
        Resultattribute = figureOutTheAttribute(text, i);
        // console.log(Resultattribute);
        i = Resultattribute.i;
        if(Resultattribute.success){
            let operation = Resultattribute.attribute;
            switch(operation){
                case "name": {
                    obj2
                    break;
                }
                case "Father's Name":{
                    response = recordFatherName(text, i, obj2);
                    obj2 = response.obj;
                    i = response.i;
                    break;
                }
                case "Husband's Name": {
                    response = recordHusbandName(text, i, obj2);
                    obj2 = response.obj;
                    i = response.i;
                    break;
                }
                case "Wife's Name":{
                    response = recordWifeName(text, i, obj2);
                    obj2=response.obj;
                    i = response.i;
                    break;
                }
                case "House Number": {
                    response = recordHouseNumber(text, i, obj2)
                    obj2 = response.obj;
                    i = response.i
                    break;
                }
                case "Age": {
                    response = recordAgeAndGender(text, i, obj2);
                    i = response.i;
                    obj2 =response.obj;
                    break;
                }
            }
        }else{ 
            const attribute = Object.keys(obj2)[Object.keys(obj2).length-1];
            name = obj2[attribute];
            obj2[attribute] = name.concat(" ", Resultattribute.attribute);
        }

        //OBJECT-3
        while(text[i] === '\t' || text[i] === '\n')i++;
        Resultattribute = figureOutTheAttribute(text, i);
        // console.log(Resultattribute);
        i = Resultattribute.i;
        if(skip3) while(text[i]!== '\n') i++;
        else{

            if(Resultattribute.success){
                let operation = Resultattribute.attribute;
            switch(operation){
                case "name": {
                    obj3
                    break;
                }
                case "Father's Name":{
                    response = recordFatherName(text, i, obj3);
                    obj3 = response.obj;
                    i = response.i;
                    break;
                }
                case "Husband's Name": {
                    response = recordHusbandName(text, i, obj3);
                    obj3 = response.obj;
                    i = response.i;
                    break;
                }
                case "Wife's Name":{
                    response = recordWifeName(text, i, obj3);
                    obj3=response.obj;
                    i = response.i;
                    break;
                }
                case "House Number": {
                    response = recordHouseNumber(text, i, obj3)
                    obj3 = response.obj;
                    i = response.i
                    break;
                }
                case "Age": {
                    response = recordAgeAndGender(text, i, obj3);
                    i = response.i;
                    obj3 =response.obj;
                    break;
                }
            }
            }else{ 
                const attribute = Object.keys(obj3)[Object.keys(obj3).length-1];
                name = obj3[attribute];
                obj3[attribute] = name.concat(" ", Resultattribute.attribute);
            }
        }
        // console.log(obj1, obj2, obj3)
        // <------------  HOUSE NUMBER -------->





        // console.log("\n\n\n")
        // <------------ AGE & GENDER -------->
        //OBJECT-1
        while(true){
            if(text[i] ==='\t')i++;
            else if(text[i] === '\n')i++
            else break;
        }
        Resultattribute = figureOutTheAttribute(text, i);
        // console.log(Resultattribute);
        i = Resultattribute.i;
        if(Resultattribute.success){
            let operation = Resultattribute.attribute;
            switch(operation){
                case "name": {
                    obj1
                    break;
                }
                case "Father's Name":{
                    response = recordFatherName(text, i, obj1);
                    obj1 = response.obj;
                    i = response.i;
                    break;
                }
                case "Husband's Name": {
                    response = recordHusbandName(text, i, obj1);
                    obj1 = response.obj;
                    i = response.i;
                    break;
                }
                case "Wife's Name":{
                    response = recordWifeName(text, i, obj1);
                    obj1=response.obj;
                    i = response.i;
                    break;
                }
                case "House Number": {
                    response = recordHouseNumber(text, i, obj1)
                    obj1 = response.obj;
                    i = response.i
                    break;
                }
                case "Age": {
                    response = recordAgeAndGender(text, i, obj1);
                    i = response.i;
                    obj1 =response.obj;
                    break;
                }
            }
            // name = ''
            // while(true){
            //     if(text[i] ==='\t')break
            //     if(text[i] ==='\n')break
            //     if(text[i] ===' ')break
            //     name += text[i];
            //     i++;
            // }
            // obj1[Resultattribute.attribute] = name;
            // if(Resultattribute.attribute === "Age"){
            //     i+=9;
            //     if(text[i] === 'F'){
            //         obj1.Gender ="Female";
            //         i+=6
            //     }else{
            //         obj1.Gender = 'Male';
            //         i+=4;
            //     }
            // } 
        }else{ 
            const attribute = Object.keys(obj1)[Object.keys(obj1).length-1];
            name = obj1[attribute];
            obj1[attribute] = name.concat(" ", Resultattribute.attribute);
        }
        // console.log(obj1, obj2, obj3)




        //OBJECT-2
        while(true){
            if(text[i] ==='\t')i++;
            else if(text[i] === '\n')i++
            else break;
        }
        Resultattribute = figureOutTheAttribute(text, i);
        i = Resultattribute.i
        if(Resultattribute.attribute === "Photo is"){
            while(true){
                if(text[i] === "\t") i++;
                else if(text[i] === '\n') i++;
                else break;
            }
        } 
        Resultattribute = figureOutTheAttribute(text, i);
        i = Resultattribute.i;
        // console.log(Resultattribute)
        if(Resultattribute.success){
            let operation = Resultattribute.attribute;
            switch(operation){
                case "name": {
                    obj2
                    break;
                }
                case "Father's Name":{
                    response = recordFatherName(text, i, obj2);
                    obj2 = response.obj;
                    i = response.i;
                    break;
                }
                case "Husband's Name": {
                    response = recordHusbandName(text, i, obj2);
                    obj2 = response.obj;
                    i = response.i;
                    break;
                }
                case "Wife's Name":{
                    response = recordWifeName(text, i, obj2);
                    obj2=response.obj;
                    i = response.i;
                    break;
                }
                case "House Number": {
                    response = recordHouseNumber(text, i, obj2)
                    obj2 = response.obj;
                    i = response.i
                    break;
                }
                case "Age": {
                    response = recordAgeAndGender(text, i, obj2);
                    i = response.i;
                    obj2 =response.obj;
                    break;
                }
            }
        }else{ 
            const attribute = Object.keys(obj2)[Object.keys(obj2).length-1];
            name = obj2[attribute];
            obj2[attribute] = name.concat(" ", Resultattribute.attribute);
        }
        // console.log(obj1, obj2, obj3)




        //OBJECT-3
        while(true){
            if(text[i] ==='\t')i++;
            else if(text[i] === '\n')i++
            else break;
        }
        Resultattribute = figureOutTheAttribute(text, i);
        i = Resultattribute.i
        if(skip3) while(text[i]!=='\n')i++;
        else{

            if(Resultattribute.attribute === "Photo is"){
                while(true){
                if(text[i] === "\t") i++;
                else if(text[i] === '\n') i++;
                else break;
            }
        } 
        Resultattribute = figureOutTheAttribute(text, i);
        i = Resultattribute.i;
        // console.log(Resultattribute)
        if(Resultattribute.success){
            let operation = Resultattribute.attribute;
            let response;
            switch(operation){
                case "name": {
                    obj3
                    break;
                }
                case "Father's Name":{
                    response = recordFatherName(text, i, obj3);
                    obj3 = response.obj;
                    i = response.i;
                    break;
                }
                case "Husband's Name": {
                    response = recordHusbandName(text, i, obj3);
                    obj3 = response.obj;
                    i = response.i;
                    break;
                }
                case "Wife's Name":{
                    response = recordWifeName(text, i, obj3);
                    obj3=response.obj;
                    i = response.i;
                    break;
                }
                case "House Number": {
                    response = recordHouseNumber(text, i, obj3)
                    obj3 = response.obj;
                    i = response.i
                    break;
                }
                case "Age": {
                    response = recordAgeAndGender(text, i, obj3);
                    i = response.i;
                    obj3 =response.obj;
                    break;
                }
            }
            }else{ 
                const attribute = Object.keys(obj3)[Object.keys(obj3).length-1];
                name = obj3[attribute];
                obj3[attribute] = name.concat(" ", Resultattribute.attribute);
            }
        }
        // console.log(obj1, obj2, obj3)
        
        // console.log(text.substring(i, i+20))
        while(text[i]!== '\n') i++;
        i++;
        if(text.substring(i, i+9) === "Available")i+=9
        else{
            Resultattribute = figureOutTheAttribute(text, i);
            console.log(Resultattribute);
            i = Resultattribute.i;
            if(Resultattribute.success){
                let operation = Resultattribute.attribute;
                switch(operation){
                    case "name": {
                        obj1
                        break;
                    }
                    case "Father's Name":{
                        response = recordFatherName(text, i, obj1);
                        obj1 = response.obj;
                        i = response.i;
                        break;
                    }
                    case "Husband's Name": {
                        response = recordHusbandName(text, i, obj1);
                        obj1 = response.obj;
                        i = response.i;
                        break;
                    }
                    case "Wife's Name":{
                        response = recordWifeName(text, i, obj1);
                        obj1=response.obj;
                        i = response.i;
                        break;
                    }
                    case "House Number": {
                        response = recordHouseNumber(text, i, obj1)
                        obj1 = response.obj;
                        i = response.i
                        break;
                    }
                    case "Age": {
                        response = recordAgeAndGender(text, i, obj1);
                        i = response.i;
                        obj1 =response.obj;
                        break;
                    }
                }
            }else{ 
                const attribute = Object.keys(obj1)[Object.keys(obj1).length-1];
                name = obj1[attribute];
                obj1[attribute] = name.concat(" ", Resultattribute.attribute);
            }
        }
        // console.log("((((((((((", text.substring(i, i+30), ")))))))")
        while(text[i]=== '\t') i++;
        while(text[i] === '\n') i++;
        while(text[i]=== '\t') i++;
        // console.log("((((((((((", text.substring(i, i+10), "))))))))")
        if(text.substring(i, i+9) === "Available")i+=9
        else{
            Resultattribute = figureOutTheAttribute(text, i);
            // console.log(Resultattribute);
            i = Resultattribute.i;
            if(Resultattribute.success){
                let operation = Resultattribute.attribute;
                switch(operation){
                    case "name": {
                        obj2
                        break;
                    }
                    case "Father's Name":{
                        response = recordFatherName(text, i, obj2);
                        obj2 = response.obj;
                        i = response.i;
                        break;
                    }
                    case "Husband's Name": {
                        response = recordHusbandName(text, i, obj2);
                        obj2 = response.obj;
                        i = response.i;
                        break;
                    }
                    case "Wife's Name":{
                        response = recordWifeName(text, i, obj2);
                        obj2=response.obj;
                        i = response.i;
                        break;
                    }
                    case "House Number": {
                        response = recordHouseNumber(text, i, obj2)
                        obj2 = response.obj;
                        i = response.i
                        break;
                    }
                    case "Age": {
                        response = recordAgeAndGender(text, i, obj2);
                        i = response.i;
                        obj2 =response.obj;
                        break;
                    }
                }
            }else{ 
                const attribute = Object.keys(obj2)[Object.keys(obj2).length-1];
                name = obj2[attribute];
                obj1[attribute] = name.concat(" ", Resultattribute.attribute);
            }
        }
        
        // console.log("((((((((((", text.substring(i, i+10), "))))))))")
        while(text[i]=== '\t') i++;
        while(text[i]=== '\n') i++;
        while(text[i]=== '\t') i++;
        // console.log("((((((((((", text.substring(i, i+10), "))))))))")
        
        if(text.substring(i, i+9) === "Available")i+=9
        else{
            Resultattribute = figureOutTheAttribute(text, i);
            console.log("-==-==-=-=-=---==-=-=-",Resultattribute);
            i = Resultattribute.i;
            if(skip3)while(text[i]!=='\n')i++;
            else{
                
                if(Resultattribute.success){
                    let operation = Resultattribute.attribute;
                switch(operation){
                    case "name": {
                        obj3
                        break;
                    }
                    case "Father's Name":{
                        response = recordFatherName(text, i, obj3);
                        obj3 = response.obj;
                        i = response.i;
                        break;
                    }
                    case "Husband's Name": {
                        response = recordHusbandName(text, i, obj3);
                        obj3 = response.obj;
                        i = response.i;
                        break;
                    }
                    case "Wife's Name":{
                        response = recordWifeName(text, i, obj3);
                        obj3=response.obj;
                        i = response.i;
                        break;
                    }
                    case "House Number": {
                        response = recordHouseNumber(text, i, obj3)
                        obj3 = response.obj;
                        i = response.i
                        break;
                    }
                    case "Age": {
                        response = recordAgeAndGender(text, i, obj3);
                        console.log("response", response)
                        i = response.i;
                        obj3 =response.obj;
                        break;
                    }
                }
                }else{ 
                    const attribute = Object.keys(obj3)[Object.keys(obj3).length-1];
                    name = obj2[attribute];
                    obj1[attribute] = name.concat(" ", Resultattribute.attribute);
                }
            }
        }
        // console.log("((((((((((", text.substring(i, i+10), "))))))))")
        while(text[i]=== '\t') i++;
        // console.log("((((((((((", text.substring(i, i+10), "))))))))")

        console.log(text.substring(i, i+15), text.length, i, i+9)
        if(text.substring(i, i+9) === "Available")i+=9
        
        console.log(obj1, obj2, obj3)
        if(!skip1)arr.push(obj1)
        if(!skip2)arr.push(obj2)
        if(!skip3)arr.push(obj3)
        // break;
        // console.log(arr)
        if(text.length === i)break;
        while(text[i]!=='\n')i++;
        i++;
    }
    console.log(arr, arr.length);
    return arr;
}

function figureOutTheAttribute(text, i){
    let attribute = '';
    // console.log("inside figureouttheAttribute", text[i]);
    while(true){
        if(text[i] === "\n")break;
        if(text[i] === "\t")break;
        if(text[i] === ":")break;
        if(text.substring(i, i+2) === " :"){
            i+=1;
            break
        };
        attribute += text[i];
        i++;
    }

    switch(attribute){
        case "Husband's Name": {
            i+=2;
            return {success: true, attribute: "Husband's Name", i};
        }
        case "Father's Name": {
            //  i += 15;
            i+=2;
            return {success: true, attribute: "Father's Name", i};
         }
         case "Wife's Name": {
            //  i += 15;
            i+=2;
            return {success: true, attribute: "Wife's Name", i};
         }
        case "House Number": {
            // i += 14;
            i+=2;
            return {success: true, attribute: "House Number", i};
         }
        case "Age": {
            // i += 6;
            i+=2;
            return {success: true, attribute: "Age", i};
        } 
        default: {
            console.log("default case hit", attribute);
            return {success: false, attribute, i}
        }
    }
}

function recordAgeAndGender(text, i, obj) {
    let age =''
    while(text[i] !== " "){
        // console.log("78", text[i]);
        age += text[i];
        i++;
    }
    obj.age = age;
    i+=9;
    if(text[i]==="F"){
        // console.log("78", text[i]);
        obj.gender = "Female";
        i+=6;
    } 
    else {
        // console.log("78", text[i]);
        obj.gender = "Male"
        i+=4
    }
    return {obj, i}
}

function recordHouseNumber(text, i, obj){
    let houseNumber = '';
    while(true){
        if(text[i] ==='\t')break
        if(text[i] ==='\n')break
        houseNumber += text[i];
        i++;
    }
    obj.houseNumber = houseNumber;
    return {obj, i};
}

function recordHusbandName(text, i, obj){
    let name = '';
    while(true){
        if(text[i] ==='\t')break
        if(text[i] ==='\n')break
        name += text[i];
        i++;
    }
    obj.husbandsName = name;
    return {obj, i}
}

function recordFatherName(text, i, obj){
    let name = '';
    while(true){
        if(text[i] ==='\t')break
        if(text[i] ==='\n')break
        name += text[i];
        i++;
    }
    obj.fathersName = name;
    return {obj, i}
}

function recordWifeName(text, i, obj){
    let name = '';
    while(true){
        if(text[i] ==='\t')break
        if(text[i] ==='\n')break
        name += text[i];
        i++;
    }
    obj.wifesName = name;
    return {obj, i}
}

module.exports = {
    ConvertImage
}