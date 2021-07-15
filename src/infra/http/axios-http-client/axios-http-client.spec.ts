import faker from 'faker'
import axios from 'axios'
import { AxiosHttpClient } from './axios-http-client'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('AxiosHttpClient', () => {
  test('should call axios with correct url', async () => {
    const sut = new AxiosHttpClient()
    const url = faker.internet.url()
    await sut.post({ url })
    expect(mockedAxios).toHaveBeenCalledWith(url)
  })
})
