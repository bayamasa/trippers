export const mockTourData = {
  tour: {
    id: 1,
    title: 'Test Tour',
    minPriceTaxIncluded: 50000,
    departsAirportId: 1,
    days: 5,
    isDirectFlight: true,
    airlinesId: 1,
    hotelId: 1,
    thumbnailFileName: 'test.jpg',
  },
  destination: {
    id: 1,
    slug: 'bali',
    nameJp: 'バリ島',
    imageFilename: 'bali.jpg',
  },
  area: {
    name: 'asia',
    nameJp: 'アジア',
  },
}

export const mockStockData = {
  id: 1,
  tourId: 1,
  eventStartDate: '2025-06-01',
  maxCapacity: 20,
  createdAt: new Date('2025-01-01T00:00:00Z'),
}

export const mockSelectChain = {
  from: jest.fn().mockReturnThis(),
  innerJoin: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
}

export const db = {
  select: jest.fn().mockReturnValue(mockSelectChain),
}
