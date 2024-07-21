const apiUrl: string = 'https://kisyapi.ru/api/' 

export async function fetchApi<T>(
    path: string,
    init?: RequestInit,
  ): Promise<T> {
    const response = await fetch(`${apiUrl}${path}`, init)
        return await response.json()
  }

export async function fetchApiResponse(
    path: string,
    init?: RequestInit,
  ) {
    const response = await fetch(`${apiUrl}${path}`, init)
    return response
  }

interface LoginData {
    email: string, 
    password: string
}


export async function sendLoginSms(data: LoginData) {
    return await fetchApiResponse(`token/admin/send_sms`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
          },
    })
  }

interface SmsData {
    temporary_token: string, 
    sms_code: string
}

export async function verifyLoginSms(data: SmsData) {
    return await fetchApiResponse(`token/admin/verify_sms/`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },

    })
  }

export async function getStatistics(filter_days: string, accessToken: string | null) {
    return await fetchApiResponse(`admin/statistics?filter_days=${filter_days}`, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`

      },

    })
  }

export async function getOrderByStatus(status: string, code: string, accessToken: string | null) {
    return await fetchApiResponse(`admin/orders?filter_by_status=${status}&search_by_phone_or_code=${code}`, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`

      },

    })
  }
  
export async function getOrderById(id: string, accessToken: string | null) {
    return await fetchApiResponse(`admin/orders/${id}`, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`

      },

    })
  }

export async function getOrdersStatuses(accessToken: string | null) {
    return await fetchApiResponse(`admin/orders/statuses`, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`

      },

    })
  }

export async function getActionLog(page: string, page_size: string, accessToken: string | null) {
    return await fetchApiResponse(`admin/action_log?page=${page}&page_size=${page_size}`, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`

      },

    })
  }

interface promocodeData {
    user?: number,
    expiration_date: string,
    discount_percentage: number,
    code?: string,
    one_use: boolean
  }

export async function createPromocode(data: promocodeData, accessToken: string | null) {
    return await fetchApiResponse(`admin/promocode/create`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },

    })
  }

interface offerData {
    type: string,
    all_products?: boolean,
    include_products?: number[],
    exclude_products?: number[]
  }

export async function createSpecialOffer(data: offerData, accessToken: string | null) {
    return await fetchApiResponse(`admin/special_offer`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },

    })
  }

export async function getPromocodes(accessToken: string | null) {
    return await fetchApiResponse(`admin/promocode`, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },

    })
  }

export async function getOffers(accessToken: string | null) {
    return await fetchApiResponse(`admin/special_offer`, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },

    })
  }

export async function deletePromocode(id: string | number, accessToken: string | null) {
    return await fetchApiResponse(`admin/promocode/${id}`, {
      method: 'DELETE',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },

    })
  }

export async function deleteOffer(id: string | number, accessToken: string | null) {
    return await fetchApiResponse(`admin/special_offer/${id}`, {
      method: 'DELETE',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },

    })
  }


export async function getKisses(accessToken: string | null) {
    return await fetchApiResponse(`admin/lucky_kiss`, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },

    })
  }
