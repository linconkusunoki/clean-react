import faker from 'faker'
import axios from 'axios'
import { AxiosHttpClient } from './axios-http-client'
import { HttpPostParams } from 'data/protocols/http'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

const makeSut = () => {
  return new AxiosHttpClient()
}

const mockPostRequest = (url = faker.internet.url()): HttpPostParams<any> => ({
  url,
  body: faker.random.objectElement()
})

describe('AxiosHttpClient', () => {
  test('should call axios with correct url and verb', async () => {
    const sut = makeSut()
    const request = mockPostRequest()
    await sut.post({ url: request.url })
    expect(mockedAxios.post).toHaveBeenCalledWith(request.url)
  })
})
