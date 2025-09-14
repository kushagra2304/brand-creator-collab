import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Users, Building2, ArrowDown, RefreshCw, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import CreatorSelect from "./components/CreatorSelect";
import BrandSelect from "./components/BrandSelect";
import MatchResult from "./components/MatchResult";
import { Creator, Brand } from "./types";
import { Github } from "lucide-react";

interface LoadingState {
  creators: boolean;
  brands: boolean;
  // loading?: boolean;
  // error?: string | null;
}

interface ErrorState {
  creators: string | null;
  brands: string | null;
}
// interface Props {
//   creators: Creator[];
//   onSelect: React.Dispatch<React.SetStateAction<Creator | null>>;
//   loading?: boolean;
//   error?: string | null;
// }


export default function App() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState<LoadingState>({ creators: true, brands: true });
  const [errors, setErrors] = useState<ErrorState>({ creators: null, brands: null });

  const fetchData = async () => {
    setLoading({ creators: true, brands: true });
    setErrors({ creators: null, brands: null });

    // Fetch creators
    try {
      const creatorsResponse = await fetch("/creators.json");
      if (!creatorsResponse.ok) {
        throw new Error(`Failed to fetch creators: ${creatorsResponse.status}`);
      }
      const creatorsData = await creatorsResponse.json();
      setCreators(creatorsData);
      setLoading(prev => ({ ...prev, creators: false }));
    } catch (error) {
      console.error("Error fetching creators:", error);
      setErrors(prev => ({ ...prev, creators: "Failed to load creators. Please try again." }));
      setLoading(prev => ({ ...prev, creators: false }));
    }

    // Fetch brands
    try {
      const brandsResponse = await fetch("/brands.json");
      if (!brandsResponse.ok) {
        throw new Error(`Failed to fetch brands: ${brandsResponse.status}`);
      }
      const brandsData = await brandsResponse.json();
      setBrands(brandsData);
      setLoading(prev => ({ ...prev, brands: false }));
    } catch (error) {
      console.error("Error fetching brands:", error);
      setErrors(prev => ({ ...prev, brands: "Failed to load brands. Please try again." }));
      setLoading(prev => ({ ...prev, brands: false }));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReset = () => {
    setSelectedCreator(null);
    setSelectedBrand(null);
  };

  const isDataLoaded = !loading.creators && !loading.brands;
  const hasErrors = errors.creators || errors.brands;
  const canShowMatch = selectedCreator && selectedBrand && isDataLoaded;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <motion.header
  initial={{ opacity: 0, y: -50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className="relative overflow-hidden bg-white shadow-sm border-b border-gray-200"
>
  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-purple-600/5" />
  <div className="relative max-w-7xl mx-auto px-6 py-8">
    
    {/* GitHub Icon at top-right */}
    <a
      href="https://github.com/kushagra2304/brand-creator-collab" // replace with your repo URL
      target="_blank"
      rel="noopener noreferrer"
      className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
    >
      <Github className="h-6 w-6" />
    </a>

    <div className="text-center space-y-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="inline-flex items-center gap-3"
      >
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl shadow-lg">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Creator–Brand Matchmaking
        </h1>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-lg text-gray-600 max-w-2xl mx-auto"
      >
        Discover perfect partnerships through intelligent matching algorithms that analyze engagement, 
        audience alignment, and brand values.
      </motion.p>
    </div>
  </div>
</motion.header>
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Error Display */}
        <AnimatePresence>
          {hasErrors && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4"
            >
              {errors.creators && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {errors.creators}
                  </AlertDescription>
                </Alert>
              )}
              {errors.brands && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {errors.brands}
                  </AlertDescription>
                </Alert>
              )}
              <div className="text-center">
                <Button onClick={fetchData} variant="outline" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Retry Loading Data
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selection Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Select Creator and Brand
            </h2>
            <p className="text-gray-600">
              Choose a creator and brand to analyze their compatibility
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Creator Selection */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Choose Creator</h3>
                {selectedCreator && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium"
                  >
                    Selected
                  </motion.div>
                )}
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <CreatorSelect
                  creators={creators}
                  onSelect={setSelectedCreator}
                  // loading={loading.creators}
                  // error={errors.creators}
                />
              </div>
            </motion.div>

            {/* Brand Selection */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Building2 className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Choose Brand</h3>
                {selectedBrand && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium"
                  >
                    Selected
                  </motion.div>
                )}
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <BrandSelect
                  brands={brands}
                  onSelect={setSelectedBrand}
                  // loading={loading.brands}
                  // error={errors.brands}
                />
              </div>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <AnimatePresence>
            {(selectedCreator || selectedBrand) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="flex justify-center gap-4"
              >
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reset Selection
                </Button>
                {canShowMatch && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2 text-green-600 font-medium"
                  >
                    <ArrowDown className="h-4 w-4" />
                    View Match Analysis Below
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Match Result Section */}
        <AnimatePresence>
          {canShowMatch && (
            <motion.section
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="text-center">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100px" }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full mb-4"
                />
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Match Analysis Results
                </h2>
                <p className="text-gray-600">
                  Comprehensive analysis of creator-brand compatibility
                </p>
              </div>

              <MatchResult creator={selectedCreator} brand={selectedBrand} />
            </motion.section>
          )}
        </AnimatePresence>

        {/* Stats Section */}
        {isDataLoaded && !hasErrors && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-8 border border-gray-200"
          >
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Platform Statistics</h3>
              <p className="text-gray-600">Current database overview</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-600">{creators.length}</div>
                <div className="text-sm text-gray-600">Available Creators</div>
              </div>
              <div className="text-center space-y-2">
                <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto">
                  <Building2 className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-purple-600">{brands.length}</div>
                <div className="text-sm text-gray-600">Partner Brands</div>
              </div>
              <div className="text-center space-y-2">
                <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto">
                  <Sparkles className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {creators.length * brands.length}
                </div>
                <div className="text-sm text-gray-600">Possible Matches</div>
              </div>
            </div>
          </motion.section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-600">
            Powered by intelligent matching algorithms • Built for modern brand partnerships
          </p>
        </div>
      </footer>
    </div>
  );
}