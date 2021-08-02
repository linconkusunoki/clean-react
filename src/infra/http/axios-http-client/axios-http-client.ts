import axios, { AxiosResponse } from 'axios'
import {
  HttpPostClient,
  HttpPostParams,
  HttpResponse
} from 'data/protocols/http'

export class AxiosHttpAdapter implements HttpPostClient {
  async post(params: HttpPostParams): Promise<HttpResponse> {
    let httpResponse: AxiosResponse

    try {
      httpResponse = await axios.post(params.url, params.body)
    } catch (error) {
      httpResponse = error.response
    }

    return {
      statusCode: httpResponse.status,
      body: httpResponse.data
    }
  }
}
