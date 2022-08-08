export interface IUserVerifyRequest {
  network: string
  account: string
  clientInfo: {
    [key: string]: unknown
  }
}
