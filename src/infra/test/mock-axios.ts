import axios from 'axios'
import faker from 'faker'

export const mockHttpResponse = () => ({
  data: faker.random.objectElement(),
  status: faker.datatype.number()
})

export const mockAxios = (): jest.Mocked<typeof axios> => {
  const mockedAxios = axios as jest.Mocked<typeof axios>
  mockedAxios.post.mockClear().mockResolvedValue({
    data: faker.random.objectElement(),
    status: faker.datatype.number()
  })
  mockedAxios.get.mockClear().mockResolvedValue({
    data: faker.random.objectElement(),
    status: faker.datatype.number()
  })
  return mockedAxios
}
