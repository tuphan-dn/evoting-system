export type L6 = {
  version: '0.1.0'
  name: 'l6'
  instructions: [
    {
      name: 'initializeCandidate'
      accounts: [
        {
          name: 'authority'
          isMut: true
          isSigner: true
        },
        {
          name: 'candidate'
          isMut: true
          isSigner: true
        },
        {
          name: 'treasurer'
          isMut: false
          isSigner: false
        },
        {
          name: 'mint'
          isMut: false
          isSigner: false
        },
        {
          name: 'candidateTokenAccount'
          isMut: true
          isSigner: false
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'tokenProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'associatedTokenProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'rent'
          isMut: false
          isSigner: false
        },
      ]
      args: [
        {
          name: 'startDate'
          type: 'i64'
        },
        {
          name: 'endDate'
          type: 'i64'
        },
      ]
    },
    {
      name: 'vote'
      accounts: [
        {
          name: 'authority'
          isMut: true
          isSigner: true
        },
        {
          name: 'candidate'
          isMut: true
          isSigner: false
        },
        {
          name: 'treasurer'
          isMut: false
          isSigner: false
        },
        {
          name: 'mint'
          isMut: false
          isSigner: false
        },
        {
          name: 'candidateTokenAccount'
          isMut: true
          isSigner: false
        },
        {
          name: 'ballot'
          isMut: true
          isSigner: false
        },
        {
          name: 'voterTokenAccount'
          isMut: true
          isSigner: false
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'tokenProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'associatedTokenProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'rent'
          isMut: false
          isSigner: false
        },
      ]
      args: [
        {
          name: 'amount'
          type: 'u64'
        },
      ]
    },
    {
      name: 'close'
      accounts: [
        {
          name: 'authority'
          isMut: true
          isSigner: true
        },
        {
          name: 'candidate'
          isMut: true
          isSigner: false
        },
        {
          name: 'treasurer'
          isMut: false
          isSigner: false
        },
        {
          name: 'mint'
          isMut: false
          isSigner: false
        },
        {
          name: 'candidateTokenAccount'
          isMut: true
          isSigner: false
        },
        {
          name: 'ballot'
          isMut: true
          isSigner: false
        },
        {
          name: 'voterTokenAccount'
          isMut: true
          isSigner: false
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'tokenProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'associatedTokenProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'rent'
          isMut: false
          isSigner: false
        },
      ]
      args: []
    },
  ]
  accounts: [
    {
      name: 'ballot'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'authority'
            type: 'publicKey'
          },
          {
            name: 'candidate'
            type: 'publicKey'
          },
          {
            name: 'amount'
            type: 'u64'
          },
        ]
      }
    },
    {
      name: 'candidate'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'mint'
            type: 'publicKey'
          },
          {
            name: 'amount'
            type: 'u64'
          },
          {
            name: 'startDate'
            type: 'i64'
          },
          {
            name: 'endDate'
            type: 'i64'
          },
        ]
      }
    },
  ]
  errors: [
    {
      code: 6000
      name: 'NotActiveCandidate'
      msg: "The candidate isn't active"
    },
    {
      code: 6001
      name: 'NotEndedCandidate'
      msg: "The candidate isn't ended"
    },
  ]
}

export const IDL: L6 = {
  version: '0.1.0',
  name: 'l6',
  instructions: [
    {
      name: 'initializeCandidate',
      accounts: [
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'candidate',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'treasurer',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'mint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'candidateTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'startDate',
          type: 'i64',
        },
        {
          name: 'endDate',
          type: 'i64',
        },
      ],
    },
    {
      name: 'vote',
      accounts: [
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'candidate',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'treasurer',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'mint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'candidateTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'ballot',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'voterTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'amount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'close',
      accounts: [
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'candidate',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'treasurer',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'mint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'candidateTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'ballot',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'voterTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: 'ballot',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'authority',
            type: 'publicKey',
          },
          {
            name: 'candidate',
            type: 'publicKey',
          },
          {
            name: 'amount',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'candidate',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'mint',
            type: 'publicKey',
          },
          {
            name: 'amount',
            type: 'u64',
          },
          {
            name: 'startDate',
            type: 'i64',
          },
          {
            name: 'endDate',
            type: 'i64',
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: 'NotActiveCandidate',
      msg: "The candidate isn't active",
    },
    {
      code: 6001,
      name: 'NotEndedCandidate',
      msg: "The candidate isn't ended",
    },
  ],
}
