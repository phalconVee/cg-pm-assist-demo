import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginScreen from "./components/LoginScreen";
import WelcomeScreen from "./components/WelcomeScreen";
import TaxProgressScreen from "./components/TaxProgressScreen";
import GetToKnowMe from "./components/GetToKnowMe";
import PersonalInfoForm from "./components/PersonalInfoForm";
import WagesIncomeScreen from "./components/WagesIncomeScreen";
import DeductionsCreditsScreen from "./components/DeductionsCreditsScreen";
import OtherTaxSituationsScreen from "./components/OtherTaxSituationsScreen";
import PrepareStateScreen from "./components/PrepareStateScreen";
import YourStateReturnsScreen from "./components/YourStateReturnsScreen";
import StateReviewScreen from "./components/StateReviewScreen";
import ReviewScreen from "./components/ReviewScreen";
import FileScreen from "./components/FileScreen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginScreen />} />
          <Route path="/welcome" element={<WelcomeScreen />} />
          <Route path="/tax-progress" element={<TaxProgressScreen />} />
          <Route path="/get-to-know-me" element={<GetToKnowMe />} />
          <Route path="/personal-info" element={<PersonalInfoForm />} />
          <Route path="/wages-income" element={<WagesIncomeScreen />} />
          <Route path="/deductions-credits" element={<DeductionsCreditsScreen />} />
          <Route path="/other-tax-situations" element={<OtherTaxSituationsScreen />} />
          <Route path="/prepare-state" element={<PrepareStateScreen />} />
          <Route path="/your-state-returns" element={<YourStateReturnsScreen />} />
          <Route path="/state-review" element={<StateReviewScreen />} />
          <Route path="/review" element={<ReviewScreen />} />
          <Route path="/file" element={<FileScreen />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
