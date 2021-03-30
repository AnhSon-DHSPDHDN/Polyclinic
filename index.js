const cypress = require('cypress');
const axios = require('axios');
const LinkAPI = 'https://clinic.inrx.vn/graphqlclinic'

const person = {
  fullName: `Customer Teo21 ${Math.random() * 100000}`,
  age: 1999
}

async function getTokenLogin() {
  const resLogin = await axios.post(LinkAPI, {
    headers: {
      'Content-Type': 'application/json'
    },
    query: `mutation login($input: LoginUserInput!){
    login(input: $input){
        accessToken
    }
  }`,
    variables: { "input": { "username": "admin", "password": "12345678" } },
  })
  if (resLogin.data.data.login) return resLogin.data.data.login.accessToken;
  return null;
}

async function tiepNhanBN(person, token) {
  // console.log(token)
  const api = {
    query: `mutation createCustomer($inputCustomer: CustomerInput!) {
      createCustomer(inputCustomer: $inputCustomer) {
        _id
        code
        fullName
        dateOfBirth
        gender
        detailAddress
        address
        idPlace
        identityCard
        mobile
        guardianName
        guardianIdentityCard
        age
        ageUnit
        drugAllergy
        job {
          code
        }
        folk {
          code
        }
        Nationality {
          code
        }
      }
    }`,
    variables: {
      inputCustomer: {
        fullName: person.fullName,
        dateOfBirth: -61472901320201,
        age: person.age,
        ageUnit: 'YEAR',
        gender: 'MALE',
        idPlace: 'fe619e29-e8c3-42b5-bbdc-2dbbb1ca3e38',
        address: 'Phường Mỹ Thạnh, Thành phố Long Xuyên, Tỉnh An Giang',
        idFolk: '2202cf97-2024-4a9b-8a56-28486d83d521',
        idNationality: '9836de0d-b2a7-4895-80e5-05d83f30a8a3',
        idJob: 'c9bb8943-7670-4c96-b23f-4ceb78d09e9b',
        drugAllergy: null
      }
    }
  }
  const resCreateCustomer = await axios.post(LinkAPI, api, {
    headers: {
      'Content-Type': 'application/json',
      'access-token': token,
    }
  })

  const newCustomer = resCreateCustomer.data.data.createCustomer;
  const resCreateReceive = await axios.post(LinkAPI, {
    variables: {
      info: {
        idDesCustomer: newCustomer._id,
        idExaminationRequests: ['8ad35096-6405-4374-8928-7e8dfe8d07fc'],
        idRooms: ['48b60755-bdd6-4245-aa75-40e6b9cb27a9'],
        infoHealthIndicator: {
          patientStatus: 'CAN_MEASURE'
        },
        examineObject: 'SERVICE',
        isEmergency: false,
        receiveform: 'EXAMINE',
        idHealthIndicatorOrder: null
      },
      idSourceNode: 'quaythuoc',
      idCurrentProfile: 'b1015a7b-9101-4075-a510-a881f1bc0c80'
    },
    query: `mutation ($info: InfoReceive!, $idSourceNode: ID, $idCurrentProfile: ID) {
        createReceive(info: $info, idSourceNode: $idSourceNode, idCurrentProfile: $idCurrentProfile) {
          _id
      }
    }`
  },
    {
      headers: {
        'Content-Type': 'application/json',
        'access-token': token,
      }
    }
  )
  console.log(resCreateCustomer.data.data.createCustomer._id)
  console.log(resCreateReceive.data)
  if (resCreateReceive.data.data.createReceive) {
    return {
      idReceive: resCreateReceive.data.data.createReceive._id,
      idCustomer: resCreateCustomer.data.data.createCustomer._id
    };
  }
  return null
}

async function thuTienBN(idReceive, idCustomer, token) {
  const api = {
    query: `mutation createReceiptReceive($input: ReceiptReceiveInput!, $idCurrentProfile: ID, $idSourceNode: ID) {
      createReceiptReceive(input: $input, idCurrentProfile: $idCurrentProfile, idSourceNode: $idSourceNode) {
        _id
        code
        receiptType
      }
    }`,
    variables: {
      input: {
        idDesAcc: "default",
        idDesNode: "quaythuoc",
        // idExaminationRequests: [],
        // idExaminations: ["2a0040d3-64f9-47d1-8c1c-876711938d4f"],
        idReceive: idReceive,
        idRooms: ["48b60755-bdd6-4245-aa75-40e6b9cb27a9"],
        idSrcAcc: "5c6144de-282d-415c-b3d9-a219a833f385",
        idSrcCustomer: idCustomer,
        idStockModels: [],
        idSupplyProcedures: [],
        idSupplyTTrans: [],
        idTTransactions: [],
        note: "Thu tiền viện phí của bệnh nhân",
        paymentType: "CASH"
      },
      idSourceNode: 'quaythuoc',
      idCurrentProfile: 'b1015a7b-9101-4075-a510-a881f1bc0c80'
    }
  }
  const resCreateReceiptReceive = await axios.post(LinkAPI, api, {
    headers: {
      'Content-Type': 'application/json',
      'access-token': token,
    }
  })
  return resCreateReceiptReceive
}

async function main() {
  let token = null;
  token = await getTokenLogin()
  const customer = await tiepNhanBN(person, token)
  // const tien = await thuTienBN(customer.idReceive, customer.idCustomer, token)
  // console.log(tien)

}
main()





