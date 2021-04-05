const cypress = require('cypress');
const axios = require('axios');
const LinkAPI = 'https://clinic.inrx.vn/graphqlclinic'

const person = {
  fullName: `Customer test ${Math.random() * 100000}`,
  age: 22
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
  if (resCreateReceive.data.data.createReceive) return {
    idReceive: resCreateReceive.data.data.createReceive._id,
    idCustomer: newCustomer._id
  };
  return null
}

async function thuTienBN(idReceive, idCustomer, token) {

  const resGetServiceReceive = await axios.post(LinkAPI, {
    query: `query getServiceReceive($idReceive: ID!, $idSourceNode: ID) {
      getServiceReceive(idReceive: $idReceive, idSourceNode: $idSourceNode)
    }`,
    variables: {
      idReceive: idReceive,
      idSourceNode: "quaythuoc"
    },
  }, {
    headers: {
      'Content-Type': 'application/json',
      'access-token': token,
    }
  })
  const examinations = await (JSON.parse(resGetServiceReceive.data.data.getServiceReceive))
  const idExaminations = examinations.map(exam => exam.idExamination)
  const examinationsString = examinations.map(exam => JSON.stringify(exam))
  console.log(examinationsString);

  const api = {
    query: `mutation createReceiptReceive($input: ReceiptReceiveInput!, $idCurrentProfile: ID, $idSourceNode: ID) {
      createReceiptReceive(input: $input, idCurrentProfile: $idCurrentProfile, idSourceNode: $idSourceNode) {
        _id
        code
        receiptType
      }
    }`,
    variables: {
      idCurrentProfile: "b1015a7b-9101-4075-a510-a881f1bc0c80",
      idSourceNode: "quaythuoc",
      input: {
        idDesAcc: "default", //32ed4c1e-e079-4970-a152-4e08e88271e2
        idDesNode: "quaythuoc",
        idExaminationRequests: examinationsString,
        idExaminations: idExaminations,
        idReceive: idReceive,
        idRooms: ["48b60755-bdd6-4245-aa75-40e6b9cb27a9"],
        idSrcAcc: "e8fe95b6-1a92-4b6e-9e39-18b160777b0e",
        idSrcCustomer: idCustomer,
        idStockModels: [],
        idSupplyProcedures: [],
        idSupplyTTrans: [],
        idTTransactions: [],
        note: "Thu tiền viện phí của bệnh nhân",
        paymentType: "CASH",
        typeGroup: JSON.stringify(examinations)
      }
    }
  }
  const resCreateReceiptReceive = await axios.post(LinkAPI, api, {
    headers: {
      'Content-Type': 'application/json',
      'access-token': token,
    }
  })
  console.log(resCreateReceiptReceive.data);
  return resCreateReceiptReceive
}

async function main() {
  let token = null;
  token = await getTokenLogin()
  const { idReceive, idCustomer } = await tiepNhanBN(person, token)
  thuTienBN(idReceive, idCustomer, token)

}
main()

// cypress.run({
//   // the path is relative to the current working directory
//   spec: './cypress/integration/examples/actions.spec.js'
// }).then((results) => {
//   console.log(results)
// }).catch((err) => {
//   console.error(err)
// })





