export interface ModelDeliveries {
  "Model S/X": number;
  "Model 3": number;
  "Model Y": number;
  Cybertruck: number;
}

export interface FactoryProduction {
  Fremont: number;
  Shanghai: number;
  Berlin: number;
  Texas: number;
}

export interface Quarter {
  quarter: string;
  year: number;
  production: number;
  deliveries: number;
  inventoryDelta: number;
  models: ModelDeliveries;
  factories: FactoryProduction;
}

export interface Annual {
  year: number;
  production: number;
  deliveries: number;
}

export interface TeslaData {
  quarters: Quarter[];
  annual: Annual[];
  meta: {
    modelOrder: string[];
    factoryOrder: string[];
    totalProduction: number;
    totalDeliveries: number;
    quarterCount: number;
    firstQuarter: string;
    lastQuarter: string;
    latestProduction: number;
    latestDeliveries: number;
  };
}
