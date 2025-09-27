import { AxiosResponse } from "axios";

import $api from "@/helpers/http";
import { AiBotMainPageBot } from "@/helpers/types";

class AiBotDetailsService {
  public async fetchAiBotsForMainPage(): Promise<AxiosResponse<AiBotMainPageBot[]>> {
    return $api.get("/profile/ai-bots/fetchAiBotsForMainPage");
  }
}

const aiBotDetailsService = new AiBotDetailsService();

export default aiBotDetailsService;
