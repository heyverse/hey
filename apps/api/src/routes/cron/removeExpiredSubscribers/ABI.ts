const ABI = [
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "account",
            type: "address"
          },
          {
            components: [
              {
                internalType: "bytes32",
                name: "key",
                type: "bytes32"
              },
              {
                internalType: "bytes",
                name: "value",
                type: "bytes"
              }
            ],
            internalType: "struct KeyValue[]",
            name: "customParams",
            type: "tuple[]"
          },
          {
            components: [
              {
                internalType: "address",
                name: "ruleAddress",
                type: "address"
              },
              {
                internalType: "bytes32",
                name: "configSalt",
                type: "bytes32"
              },
              {
                components: [
                  {
                    internalType: "bytes32",
                    name: "key",
                    type: "bytes32"
                  },
                  {
                    internalType: "bytes",
                    name: "value",
                    type: "bytes"
                  }
                ],
                internalType: "struct KeyValue[]",
                name: "ruleParams",
                type: "tuple[]"
              }
            ],
            internalType: "struct RuleProcessingParams[]",
            name: "ruleProcessingParams",
            type: "tuple[]"
          }
        ],
        internalType: "struct Group.MemberBatchParams[]",
        name: "membersToRemove",
        type: "tuple[]"
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "key",
            type: "bytes32"
          },
          {
            internalType: "bytes",
            name: "value",
            type: "bytes"
          }
        ],
        internalType: "struct KeyValue[]",
        name: "customParams",
        type: "tuple[]"
      }
    ],
    name: "removeMembers",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];

export default ABI;
