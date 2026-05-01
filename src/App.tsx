import { Switch, Route } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import GPSFinder from '@/pages/GPSFinder';
import ReceiptScanner from '@/pages/ReceiptScanner';
import MileageTracker from '@/pages/MileageTracker';
import ExpenseTracker from '@/pages/ExpenseTracker';
import Weather from '@/pages/Weather';
import BreakTimer from '@/pages/BreakTimer';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 1 },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/gps" component={GPSFinder} />
          <Route path="/scanner" component={ReceiptScanner} />
          <Route path="/mileage" component={MileageTracker} />
          <Route path="/expenses" component={ExpenseTracker} />
          <Route path="/weather" component={Weather} />
          <Route path="/timer" component={BreakTimer} />
          <Route>
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-2">404</h1>
                <p className="text-white/40">Page not found</p>
                <a href="/" className="text-cyan-400 hover:text-cyan-300 text-sm mt-4 inline-block"><- Back to Dashboard</a>
              </div>
            </div>
          </Route>
        </Switch>
      </Layout>
    </QueryClientProvider>
  );
}
