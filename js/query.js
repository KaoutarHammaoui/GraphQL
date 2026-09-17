export const query = `
      {
        user {
          id
          login
          avatarUrl
          auditRatio
          totalUp
          totalDown
    
        }
        xps :  transaction_aggregate (where : {eventId: {_eq:41} type:{_eq:"xp"}}){
                aggregate {
                  sum{
                    amount
                  }
                }
              }
        level: transaction(
          where: { type: { _eq: "level" } }
          order_by: { createdAt: desc }
          limit: 1
        ) {
          amount
          path
          createdAt
        }

        projects: transaction(
          where: {
            _and: [
              { type: { _eq: "xp" } }
              { path: { _like: "/oujda/module/%" } }
              { path: { _nlike: "/oujda/module/piscine-js/%" } }
              { path: { _nlike: "/oujda/module/checkpoint/%" } }
            ]
          }
          order_by: { createdAt: desc }
        ) {
          path
          amount
          createdAt
        }
      }
    `