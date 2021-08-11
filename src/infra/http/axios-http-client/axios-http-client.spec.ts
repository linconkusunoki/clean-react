import axios from 'axios'
import { AxiosHttpAdapter } from './axios-http-client'
import { mockAxios, mockHttpResponse } from 'infra/test'
import { mockGetRequest, mockPostRequest } from 'data/test'

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
  describe('post', () => {
    test('should call axios.post with correct verbs', async () => {
      const { sut, mockedAxios } = makeSut()
      const request = mockPostRequest()
      await sut.post(request)
      expect(mockedAxios.post).toHaveBeenCalledWith(request.url, request.body)
    })

    test('should return correct response on axios.post', () => {
      const { sut, mockedAxios } = makeSut()
      const promise = sut.post(mockPostRequest())
      expect(promise).toEqual(mockedAxios.post.mock.results[0].value)
    })

    test('should return correct error on axios.post', () => {
      const { sut, mockedAxios } = makeSut()
      mockedAxios.post.mockRejectedValueOnce({
        response: mockHttpResponse()
      })
      const promise = sut.post(mockPostRequest())
      expect(promise).toEqual(mockedAxios.post.mock.results[0].value)
    })
  })

  describe('get', () => {
    test('should call axios.get with correct values', async () => {
      const { sut, mockedAxios } = makeSut()
      const request = mockGetRequest()
      await sut.get(request)
      expect(mockedAxios.get).toHaveBeenCalledWith(request.url)
    })
  })
})
