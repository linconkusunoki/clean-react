import axios from 'axios'
import { AxiosHttpAdapter } from './axios-http-client'
import { mockAxios, mockHttpResponse } from 'infra/test'
import { mockPostRequest } from 'data/test'

jest.mock('axios')

type SutTypes = {
  sut: AxiosHttpAdapter
  mockedAxios: jest.Mocked<typeof axios>
}

const makeSut = (): SutTypes => {
  const sut = new AxiosHttpAdapter()
  const mockedAxios = mockAxios()
  return {
    sut,
    mockedAxios
  }
}

describe('AxiosHttpClient', () => {
  test('should call axios with correct verbs', async () => {
    const { sut, mockedAxios } = makeSut()
    const request = mockPostRequest()
    await sut.post(request)
    expect(mockedAxios.post).toHaveBeenCalledWith(request.url, request.body)
  })

  test('should return the correct status code and body', () => {
    const { sut, mockedAxios } = makeSut()
    const promise = sut.post(mockPostRequest())
    expect(promise).toEqual(mockedAxios.post.mock.results[0].value)
  })

  test('should return the correct status code and body on failure', () => {
    const { sut, mockedAxios } = makeSut()
    mockedAxios.post.mockRejectedValueOnce({
      response: mockHttpResponse()
    })
    const promise = sut.post(mockPostRequest())
    expect(promise).toEqual(mockedAxios.post.mock.results[0].value)
  })
})
