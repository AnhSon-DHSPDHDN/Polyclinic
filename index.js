const cypress = require('cypress');
const axios = require('axios');
const LinkAPI = 'https://clinic.inrx.vn/graphqlclinic'

const person = {
  fullName: `Customer test ${Math.random() * 100000}`,
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
  console.log(token)
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
        idExaminationRequests: ['8ad35096-6405-4374-8928-7e8dfe8d07fc', '22393f4c-e6f0-45fb-a809-ebdf7caf9f45'],
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
  if (resCreateReceive.data.data.createReceive) return resCreateReceive.data.data.createReceive._id;
  return null
}

async function thuTienBN(idReceive) {

}

async function main() {
  let token = null;
  token = await getTokenLogin()
  tiepNhanBN(person, token)

  // await cypress.run({
  //   // the path is relative to the current working directory
  //   spec: './cypress/integration/examples/actions.spec.js'
  // }).then((results) => {
  //   console.log(results)
  // }).catch((err) => {
  //   console.error(err)
  // })
  // console.log('hihi');
}
main()

// fetch("https://clinic.inrx.vn/graphqlclinic", {
//   "headers": {
//     "accept": "*/*",
//     "accept-language": "vi,en-US;q=0.9,en;q=0.8",
//     "access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3N1ZXIiOiJodHRwOi8vY2huaXJ0LmdpdGh1Yi5pbyIsInN1YmplY3QiOiIwIiwiaWF0IjoxNjE2Mzg1MTY2LCJleHAiOjE2MTg5NzcxNjZ9.Ugu57ilCU-Z_bdzrVmGJIBCZJgpuXDCpjXZM-m-h26s",
//     "content-type": "application/json",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-origin"
//   },
//   "referrer": "https://clinic.inrx.vn/clinic/receive",
//   "referrerPolicy": "no-referrer-when-downgrade",
//   "body": "{\"operationName\":null,\"variables\":{\"info\":{\"idDesCustomer\":\"1edd1e7e-01c3-4fd4-94a9-977246dd5d2e\",\"idExaminationRequests\":[\"8ad35096-6405-4374-8928-7e8dfe8d07fc\"],\"idRooms\":[\"48b60755-bdd6-4245-aa75-40e6b9cb27a9\"],\"infoHealthIndicator\":{\"patientStatus\":\"CAN_MEASURE\"},\"examineObject\":\"SERVICE\",\"isEmergency\":false,\"receiveform\":\"EXAMINE\",\"idHealthIndicatorOrder\":null},\"idSourceNode\":\"quaythuoc\",\"idCurrentProfile\":\"b1015a7b-9101-4075-a510-a881f1bc0c80\"},\"query\":\"mutation ($info: InfoReceive!, $idSourceNode: ID, $idCurrentProfile: ID) {\\n  createReceive(info: $info, idSourceNode: $idSourceNode, idCurrentProfile: $idCurrentProfile) {\\n    _id\\n  }\\n}\\n\"}",
//   "method": "POST",
//   "mode": "cors"
// }); ;
// fetch("https://clinic.inrx.vn/graphqlclinic", {
//   "headers": {
//     "accept": "*/*",
//     "accept-language": "vi,en-US;q=0.9,en;q=0.8",
//     "access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3N1ZXIiOiJodHRwOi8vY2huaXJ0LmdpdGh1Yi5pbyIsInN1YmplY3QiOiIwIiwiaWF0IjoxNjE2Mzg1MTY2LCJleHAiOjE2MTg5NzcxNjZ9.Ugu57ilCU-Z_bdzrVmGJIBCZJgpuXDCpjXZM-m-h26s",
//     "content-type": "application/json",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-origin"
//   },
//   "referrer": "https://clinic.inrx.vn/clinic/receive",
//   "referrerPolicy": "no-referrer-when-downgrade",
//   "body": "{\"operationName\":null,\"variables\":{\"startDate\":1616346000000,\"endDate\":1616432399999,\"idSourceNode\":\"quaythuoc\"},\"query\":\"query ($startDate: Float, $endDate: Float, $idSourceNode: ID) {\\n  getReceives(startDate: $startDate, endDate: $endDate, idSourceNode: $idSourceNode) {\\n    _id\\n    code\\n    desCustomer {\\n      _id\\n      code\\n      fullName\\n      dateOfBirth\\n      gender\\n      fullAddress\\n      mobile\\n    }\\n    stateSubclinical\\n    state\\n    examinations {\\n      code\\n      stateSubclinical\\n      state\\n    }\\n    rooms {\\n      name\\n    }\\n    createdAt\\n    medicalHistoryCode\\n  }\\n}\\n\"}",
//   "method": "POST",
//   "mode": "cors"
// }); ;
// fetch("https://clinic.inrx.vn/graphqlclinic", {
//   "headers": {
//     "accept": "*/*",
//     "accept-language": "vi,en-US;q=0.9,en;q=0.8",
//     "access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3N1ZXIiOiJodHRwOi8vY2huaXJ0LmdpdGh1Yi5pbyIsInN1YmplY3QiOiIwIiwiaWF0IjoxNjE2Mzg1MTY2LCJleHAiOjE2MTg5NzcxNjZ9.Ugu57ilCU-Z_bdzrVmGJIBCZJgpuXDCpjXZM-m-h26s",
//     "content-type": "application/json",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-origin"
//   },
//   "referrer": "https://clinic.inrx.vn/clinic/receive",
//   "referrerPolicy": "no-referrer-when-downgrade",
//   "body": "{\"operationName\":null,\"variables\":{\"id\":\"fb418864-617b-491a-80b7-1e234cff0a25\",\"idSourceNode\":\"quaythuoc\"},\"query\":\"query ($id: ID!, $idSourceNode: ID) {\\n  getReceive(id: $id, idSourceNode: $idSourceNode) {\\n    _id\\n    idDesCustomer\\n    idExaminationRequests\\n    idRooms\\n    idDesignator\\n    state\\n    code\\n    total\\n    examineObject\\n    isEmergency\\n    receiveform\\n    isPrioritize\\n    createdAt\\n    idDesAcc\\n    idSrcAcc\\n    idSrcNode\\n    examinationRequestPrices\\n    healthIndicatorOrder {\\n      fullOrder\\n    }\\n    idHealthIndicatorOrder\\n    healthIndicators {\\n      patientStatus\\n      bodyTemperature\\n      bloodPressureTthu\\n      bloodPressureTtr\\n      circuit\\n      breathing\\n      height\\n      weight\\n      currentWeight\\n      round2\\n      round3\\n      roundArm\\n    }\\n    desCustomer {\\n      _id\\n      code\\n      fullName\\n      dateOfBirth\\n      gender\\n      detailAddress\\n      address\\n      idPlace\\n      identityCard\\n      mobile\\n      guardianName\\n      guardianIdentityCard\\n      age\\n      ageUnit\\n      drugAllergy\\n      idAccountingObject\\n      job {\\n        code\\n      }\\n      folk {\\n        code\\n      }\\n      Nationality {\\n        code\\n      }\\n    }\\n    examinations {\\n      state\\n      isCollected\\n      _id\\n    }\\n  }\\n}\\n\"}",
//   "method": "POST",
//   "mode": "cors"
// }); ;
// fetch("https://clinic.inrx.vn/clinic/static/assets/images/8f50b2b53399f5393e8128217c142034.svg", {
//   "referrer": "https://clinic.inrx.vn/clinic/receive",
//   "referrerPolicy": "no-referrer-when-downgrade",
//   "body": null,
//   "method": "GET",
//   "mode": "cors"
// }); ;
// fetch("https://clinic.inrx.vn/clinic/static/assets/images/60269c906ba8c5497f2a80063fa9974e.svg", {
//   "referrer": "https://clinic.inrx.vn/clinic/receive",
//   "referrerPolicy": "no-referrer-when-downgrade",
//   "body": null,
//   "method": "GET",
//   "mode": "cors"
// }); ;
// fetch("https://clinic.inrx.vn/graphqlclinic", {
//   "headers": {
//     "accept": "*/*",
//     "accept-language": "vi,en-US;q=0.9,en;q=0.8",
//     "access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3N1ZXIiOiJodHRwOi8vY2huaXJ0LmdpdGh1Yi5pbyIsInN1YmplY3QiOiIwIiwiaWF0IjoxNjE2Mzg1MTY2LCJleHAiOjE2MTg5NzcxNjZ9.Ugu57ilCU-Z_bdzrVmGJIBCZJgpuXDCpjXZM-m-h26s",
//     "content-type": "application/json",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-origin"
//   },
//   "referrer": "https://clinic.inrx.vn/clinic/receive",
//   "referrerPolicy": "no-referrer-when-downgrade",
//   "body": "{\"operationName\":null,\"variables\":{},\"query\":\"{\\n  getInfoNodeRoomExamine {\\n    name\\n    infoExamineByDay {\\n      waitingForExamine\\n      examining\\n      total\\n    }\\n  }\\n}\\n\"}",
//   "method": "POST",
//   "mode": "cors"
// }); ;
// fetch("https://clinic.inrx.vn/graphqlclinic", {
//   "headers": {
//     "accept": "*/*",
//     "accept-language": "vi,en-US;q=0.9,en;q=0.8",
//     "access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3N1ZXIiOiJodHRwOi8vY2huaXJ0LmdpdGh1Yi5pbyIsInN1YmplY3QiOiIwIiwiaWF0IjoxNjE2Mzg1MTY2LCJleHAiOjE2MTg5NzcxNjZ9.Ugu57ilCU-Z_bdzrVmGJIBCZJgpuXDCpjXZM-m-h26s",
//     "content-type": "application/json",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-origin"
//   },
//   "referrer": "https://clinic.inrx.vn/clinic/receive",
//   "referrerPolicy": "no-referrer-when-downgrade",
//   "body": "{\"operationName\":null,\"variables\":{\"idDesCustomer\":\"1edd1e7e-01c3-4fd4-94a9-977246dd5d2e\",\"isNotCanceled\":true},\"query\":\"query ($idDesCustomer: ID!, $isNotCanceled: Boolean) {\\n  getReceivesByIdDesCustomer(idDesCustomer: $idDesCustomer, isNotCanceled: $isNotCanceled) {\\n    _id\\n    createdAt\\n    examinationRequests {\\n      name\\n      code\\n    }\\n    rooms {\\n      code\\n      name\\n    }\\n  }\\n}\\n\"}",
//   "method": "POST",
//   "mode": "cors"
// }); ;
// fetch("https://clinic.inrx.vn/graphqlclinic", {
//   "headers": {
//     "accept": "*/*",
//     "accept-language": "vi,en-US;q=0.9,en;q=0.8",
//     "access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3N1ZXIiOiJodHRwOi8vY2huaXJ0LmdpdGh1Yi5pbyIsInN1YmplY3QiOiIwIiwiaWF0IjoxNjE2Mzg1MTY2LCJleHAiOjE2MTg5NzcxNjZ9.Ugu57ilCU-Z_bdzrVmGJIBCZJgpuXDCpjXZM-m-h26s",
//     "content-type": "application/json",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-origin"
//   },
//   "referrer": "https://clinic.inrx.vn/clinic/receive",
//   "referrerPolicy": "no-referrer-when-downgrade",
//   "body": "{\"operationName\":null,\"variables\":{\"idReceive\":\"fb418864-617b-491a-80b7-1e234cff0a25\"},\"query\":\"query ($idReceive: ID!, $type: String) {\\n  getImageDiagnosisesByidReceive(idReceive: $idReceive, type: $type) {\\n    _id\\n    idSrcNode\\n    idSrcAcc\\n    idDesAcc\\n    idSrcStore\\n    idDesCustomer\\n    idDoctor\\n    state\\n    type\\n    code\\n    createdAt\\n    idDesignator\\n    designator {\\n      fullName\\n    }\\n    tTransaction {\\n      _id\\n      price\\n      idTest\\n      test {\\n        name\\n      }\\n    }\\n    srcNode {\\n      _id\\n      name\\n    }\\n  }\\n}\\n\"}",
//   "method": "POST",
//   "mode": "cors"
// });

// cypress.run({
//   // the path is relative to the current working directory
//   spec: './cypress/integration/examples/actions.spec.js'
// }).then((results) => {
//   console.log(results)
// }).catch((err) => {
//   console.error(err)
// })





