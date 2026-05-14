
export const config = {
    validation: {
        itsId: {
            minLength: 8,
            maxLength: 8,
            regExp: /^[0-9\+]*$/i
        },
        password: {
            maxLength: 20
        },
        email: {
            maxLength: 99,
            minLength: 6,
            regExp: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i
        },
        name: {
            maxLength: 100,
            minLength: 3,
            regExp: /^[a-zA-Z]+[a-zA-Z ]*$/i
        },
        templatename: {
            maxLength: 200,
            minLength: 5,
            regExp: /^[a-zA-Z]+[a-zA-Z ]*$/i
        },
        carrier: {
            regExp: /^[a-zA-Z]+[a-zA-Z ]*$/i
        },
        phone: {
            minLength: 10,
            maxLength: 15,
            regExp: /^[0-9\+]*$/i
        },
        address: {
            minLength: 2,
            maxLength: 255
        },
        serialNumber: {
            minLength: 8,
            maxLength: 255
        },
        zipCode: {
            minLength: 5,
            maxLength: 10,
            regExp: /^([0-9]+[a-zA-Z][0-9a-zA-Z]*)|([a-zA-Z]+[0-9][0-9a-zA-Z]*)$|(^[0-9]*)$/i
        },
        textField: {
            minLength: 1,
            maxLength: 99
        },
        entityName: {
            minLength: 2,
            maxLength: 99
        },
        imeiNumber: {
            minLength: 15,
            maxLength: 15,
            regExp: /^[0-9\+]*$/i
        },
        simNumber: {
            minLength: 20,
            maxLength: 20,
            regExp: /^[0-9\+]*$/i
        },
        ipaddress: {
            RegExp: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
        },
        opratorName: {
            minLength: 2,
            maxLength: 40,
            regExp: /^([.',a-zA-Z0-9 ]*)$/i
        }, 
        description: {
            minLength: 0,
            maxLength: 250,
        }, 
        number: {
            regExp: /^[0-9\+]*$/i
        },
        itemTitle: {
            maxLength: 100,
            minLength: 3,
            regExp: /^[a-zA-Z]+[a-zA-Z0-9 ]*$/i
        },
        departmentUmoorName: {
            maxLength: 100,
            minLength: 3,
            regExp: /^[a-zA-Z]+[a-zA-Z0-9 ]*$/i
        },
        trophies: {
            minLength: 1,
            maxLength: 5,
            RegExp: /^[0-9\+]*$/i
        },
        question: {
            maxLength: 400,
            minLength: 10,
            regExp: /^[a-zA-Z]+[a-zA-Z ]*$/i
        },
        subject: {
            minLength: 1,
            maxLength: 500
        },
        message: {
            minLength: 1,
            maxLength: 1000
        },
        remarks:{
        minLength: 1,
            maxLength: 1000
        }
    },
    validationMessages: {
        itsId: 'ITS ID should be 8 digits positive numbers',
        password: 'Password should be upto 20 characters',
        name: 'Name should be between 3 to 100 characters.',
        templatename: 'Name should be between 5 to 200 characters.',
        email: 'Email should of format example@domain.com',
        emailLength: 'Email should be upto 99 characters',
        phone: 'Phone should be between 10 to 15 digits',
        required: 'Field is required',
        address: 'Address should be upto 255 characters',
        zipCode: 'Zip code should be between 5 to 10 alphanumeric letters',
        warrantyDuration: 'Warranty duration should be a number upto 3650.',
        entityName: 'Entity name should be between 2 and 99 alphabets',
        opratorName: 'Operator name should be between 2 and 40 alphabets',
        serialNumber: 'Serial Number should be between 8 and 255 digit',
        imeiNumber: 'IMEI Number should be 15 digit',
        simNumber: 'Sim Number should be 20 digit',
        ipaddress: 'IP address should of format 0.0.0.0',
        carrier: 'Carrier should be alphabets',
        number: ' Should be a positive number.',
        minAge:" Min age should be a positive number",
        maxAge:" Max age should be a positive number",
        minMaxNumber: 'Max age should be greater than min age',
        retries : 'Retries should be a positive number',
        retryInterval: 'RetryInterval should be a positive number.',
        description: 'Description should be upto 250 characters',
        status: 'Status is required.',
        umoor: 'Umoor is required.',
        question: 'Question should be between 10 to 400 characters',
        type: 'Type is required.',
        trophies: 'Trophy Count should be upto 5 digits positive number.',
        niyatType: 'Niyat Type is required.',
        department: 'Department is required.',
        chooseType: 'Choose Type is required.',
        itemTitle: 'Item Title should be between 3 to 100 alphanumeric characters.',
        departmentUmoorName: 'Name should be between 3 to 100 alphanumeric characters.',
        message: 'Message should be upto 1000 characters.',
        subject: 'Subject should be upto 500 characters.',
        remarks: 'Remarks should be upto 500 characters.',
        maximumReward:'Maximum reward should be greater than 0.'
    },
    paging: {
        pageSizeOptions: [5, 10, 25, 100],
        length: 100,
        pageSize: 10
    }
};
