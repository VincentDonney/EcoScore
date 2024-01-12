export interface MarkerProperties {
    position: {
        lat: number;
        lng: number;
    }
    label: string;
    organicRate: number;
    climateRate: number;
    waterSavyRate: number;
    socialRate: number;
    governanceRate: number;
    wasteRate: number;
    adverseRate: number;
    index: number;
}
