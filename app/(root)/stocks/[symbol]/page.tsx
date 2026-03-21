import TradingViewWidget from "@/components/TradingViewWidget";
import WatchlistButton from "@/components/WatchlistButton";
import { WatchListItem } from "@/database/models/watchlist.model";
import { getStockDetails } from "@/lib/actions/finnhub.actions";
import { getUserWatchList } from "@/lib/actions/watchlist.actions";
import {
  BASELINE_WIDGET_CONFIG,
  CANDLE_CHART_WIDGET_CONFIG,
  COMPANY_FINANCIALS_WIDGET_CONFIG,
  COMPANY_PROFILE_WIDGET_CONFIG,
  SYMBOL_INFO_WIDGET_CONFIG,
  TECHNICAL_ANALYSIS_WIDGET_CONFIG,
} from "@/lib/constants";
import { notFound } from "next/navigation";

const StockDetails = async ({ params }: StockDetailsPageProps) => {
  const { symbol } = await params;
  const stocksData = await getStockDetails(symbol);
  const userWatchList = await getUserWatchList();
  const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

  const inWatchList = userWatchList.some(
    (stock: WatchListItem) => stock.symbol === symbol.toUpperCase(),
  );

  if (!stocksData) return notFound();
  return (
    <div className="flex min-h-screen p-4 md:p-6 lg:p-8">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        {/* Left column */}
        <div className="flex flex-col col-span-2 gap-6">
          <TradingViewWidget
            scriptUrl={`${scriptUrl}symbol-info.js`}
            config={SYMBOL_INFO_WIDGET_CONFIG(symbol)}
            height={170}
          />

          <TradingViewWidget
            scriptUrl={`${scriptUrl}advanced-chart.js`}
            config={CANDLE_CHART_WIDGET_CONFIG(symbol)}
            className="custom-chart"
            height={600}
          />

          <TradingViewWidget
            scriptUrl={`${scriptUrl}advanced-chart.js`}
            config={BASELINE_WIDGET_CONFIG(symbol)}
            className="custom-chart"
            height={600}
          />
        </div>

        {/* Right column */}
        <div className="flex flex-col col-span-1 gap-6">
          <div className="flex items-center justify-between">
            <WatchlistButton
              symbol={symbol.toUpperCase()}
              company={stocksData.company}
              isInWatchlist={inWatchList}
              type="button"
            />
          </div>

          <TradingViewWidget
            scriptUrl={`${scriptUrl}technical-analysis.js`}
            config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(symbol)}
            height={400}
          />

          <TradingViewWidget
            scriptUrl={`${scriptUrl}company-profile.js`}
            config={COMPANY_PROFILE_WIDGET_CONFIG(symbol)}
            height={440}
          />

          <TradingViewWidget
            scriptUrl={`${scriptUrl}financials.js`}
            config={COMPANY_FINANCIALS_WIDGET_CONFIG(symbol)}
            height={464}
          />
        </div>
      </section>
    </div>
  );
};

export default StockDetails;
