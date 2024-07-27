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
    return await fetchApiResponse(`admin/statistics${filter_days ? `?filter_days=${filter_days}` : ''}`, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`

      },

    })
  }

export async function getOrderByStatus(status: string, code: string, accessToken: string | null) {
    return await fetchApiResponse(`admin/orders?filter_by_status=${status}${code ? `&search_by_phone_or_code=${code}` : ''}`, {
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

interface notificationData {
    user_id: number,
    title: string,
    body: string
}

export async function notification(data: notificationData, accessToken: string | null) {
    return await fetchApiResponse(`admin/notification/`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`

      },

    })
  }


export async function getAccounts(email: string, name: string, phone: string, accessToken: string | null) {
    return await fetchApiResponse(`admin/accounts${email ? `?search_by_email=${email}` : ''}${name ? email ? `&search_by_name=${name}` : `?search_by_name=${name}` : ''}${phone ? email ? `&search_by_phone=${phone}` : name ? `&search_by_phone=${phone}` : `?search_by_phone=${phone}` : ''}`, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },

    })
  }


  export async function getAccountById(id: string, accessToken: string | null) {
    return await fetchApiResponse(`admin/accounts/${id}`, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },

    })
  }


interface accountPatchData {
    phone_number: string,
    email: string,
    first_name: string,
    last_name: string,
    date_of_birth: string,
    lucky_kiss_new_amount: number
}

export async function patchAccount(data: accountPatchData, id: string, accessToken: string | null) {
    return await fetchApiResponse(`admin/accounts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },

    })
  }




export async function getAccountPromocodes(id: string, accessToken: string | null) {
    return await fetchApiResponse(`admin/accounts/${id}/promocodes`, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },

    })
  }

export async function getAccountOrders(id: string, accessToken: string | null) {
    return await fetchApiResponse(`admin/accounts/${id}/orders`, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },

    })
  }


export async function getCategories(id: string, accessToken: string | null) {
    return await fetchApiResponse(`categories/${id}/contents/`, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },

    })
  }

export async function patchMeditation(data: FormData, id: string, accessToken: string | null) {
    return await fetchApiResponse(`admin/meditation/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
        'Authorization': `Bearer ${accessToken}`
      },

    })
  }

export async function createMeditation(data: FormData, accessToken: string | null) {
    return await fetchApiResponse(`admin/meditation-create/`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
        'Authorization': `Bearer ${accessToken}`
      },

    })
  }

export async function deleteMeditation(id: string, accessToken: string | null) {
    return await fetchApiResponse(`admin/meditation/${id}`, {
      method: 'DELETE',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },

    })
  }


export async function getBanners(accessToken: string | null) {
    return await fetchApiResponse(`admin/banners/`, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },

    })
  }

export async function patchBanner(data: FormData, id: string, accessToken: string | null) {
    return await fetchApiResponse(`admin/banners/${id}/update`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
        'Authorization': `Bearer ${accessToken}`
      },

    })
  }

export async function createBanner(data: FormData, accessToken: string | null) {
    return await fetchApiResponse(`admin/banners/`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
        'Authorization': `Bearer ${accessToken}`
      },

    })
  }

export async function deleteBanner(id: string, accessToken: string | null) {
    return await fetchApiResponse(`admin/banners/${id}/`, {
      method: 'DELETE',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },

    })
  }
