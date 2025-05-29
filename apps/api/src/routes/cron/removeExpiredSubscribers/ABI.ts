const ABI = [
  {
    type: "function",
    name: "removeMembers",
    inputs: [
      {
        name: "membersToRemove",
        type: "tuple[]",
        internalType: "struct Group.MemberBatchParams[]",
        components: [
          {
            name: "account",
            type: "address",
            internalType: "address"
          },
          {
            name: "customParams",
            type: "tuple[]",
            internalType: "struct KeyValue[]",
            components: [
              {
                name: "key",
                type: "bytes32",
                internalType: "bytes32"
              },
              {
                name: "value",
                type: "bytes",
                internalType: "bytes"
              }
            ]
          },
          {
            name: "ruleProcessingParams",
            type: "tuple[]",
            internalType: "struct RuleProcessingParams[]",
            components: [
              {
                name: "ruleAddress",
                type: "address",
                internalType: "address"
              },
              {
                name: "configSalt",
                type: "bytes32",
                internalType: "bytes32"
              },
              {
                name: "ruleParams",
                type: "tuple[]",
                internalType: "struct KeyValue[]",
                components: [
                  {
                    name: "key",
                    type: "bytes32",
                    internalType: "bytes32"
                  },
                  {
                    name: "value",
                    type: "bytes",
                    internalType: "bytes"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        name: "customParams",
        type: "tuple[]",
        internalType: "struct KeyValue[]",
        components: [
          {
            name: "key",
            type: "bytes32",
            internalType: "bytes32"
          },
          {
            name: "value",
            type: "bytes",
            internalType: "bytes"
          }
        ]
      }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  }
];

export default ABI;
