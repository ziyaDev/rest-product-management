import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { filter, map, take } from "rxjs";

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  getCreditCards() {
    const data = this.httpService
      .get<
        {
          id: number;
          uid: string;
          credit_card_number: string;
          credit_card_expiry_date: string;
          credit_card_type: string;
        }[]
      >("https://random-data-api.com/api/v2/credit_cards?size=100")
      .pipe(
        map((res) => {
          // filter out the data we don't want
          const filterdData = res.data
            .filter((card) => {
              return card.credit_card_type === "visa";
            })
            .map(({ credit_card_number, ...rest }) => rest);
          return filterdData;
        })
      );

    return data;
  }
}
