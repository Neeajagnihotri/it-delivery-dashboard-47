
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { AlertCircle, Wifi, WifiOff, Globe, Server } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [corsError, setCorsError] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setConnectionError(false);
    setCorsError(false);

    try {
      await login(email, password);
      navigate("/");
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : "Invalid credentials";
      
      if (errorMessage.includes("Unable to connect to server")) {
        setConnectionError(true);
        toast({
          title: "Connection Error",
          description: "Cannot connect to backend server. Please ensure it's running on port 5000.",
          variant: "destructive",
        });
      } else if (errorMessage.includes("CORS policy") || errorMessage.includes("Connection blocked")) {
        setCorsError(true);
        toast({
          title: "CORS Error",
          description: "Connection blocked by browser security. See solutions below.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="text-center pb-8">
            <div className="mb-6">
              <img 
                src="/lovable-uploads/a90c85f8-ec35-4fc0-8078-06c2363e005a.png" 
                alt="Zapcom Group" 
                className="h-16 mx-auto"
              />
            </div>
            <CardTitle className="text-2xl font-semibold text-gray-900">
              IT Delivery Dashboard
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Sign in to access your dashboard
            </CardDescription>
            
            {connectionError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-sm text-red-700">
                <WifiOff className="h-4 w-4" />
                <span>Backend server not connected</span>
              </div>
            )}

            {corsError && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-center gap-2 text-sm text-yellow-700">
                <Globe className="h-4 w-4" />
                <span>CORS policy blocking connection</span>
              </div>
            )}
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 px-4 border-gray-300 focus:border-primary focus:ring-primary"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 px-4 border-gray-300 focus:border-primary focus:ring-primary"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium text-base"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Demo Credentials:
              </p>
              <div className="text-xs text-gray-500 mt-2 space-y-1">
                <div>Admin: admin@zapcg.com / admin123</div>
                <div>Finance: finance@zapcg.com / finance123</div>
                <div>HR: hr@zapcg.com / hr123</div>
                <div>Manager: manager@zapcg.com / manager123</div>
                <div>Delivery: delivery@zapcg.com / delivery123</div>
              </div>
            </div>

            {connectionError && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex items-center gap-2 text-sm text-yellow-800 mb-2">
                  <Server className="h-4 w-4" />
                  <span className="font-medium">Backend Server Required</span>
                </div>
                <p className="text-xs text-yellow-700 mb-2">
                  To use this app, start the backend server:
                </p>
                <code className="text-xs bg-yellow-100 px-2 py-1 rounded block mb-2">
                  cd backend && python start_dev_server.py
                </code>
                <p className="text-xs text-yellow-600">
                  Make sure the server is running on http://localhost:5000
                </p>
              </div>
            )}

            {corsError && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-center gap-2 text-sm text-blue-800 mb-2">
                  <Globe className="h-4 w-4" />
                  <span className="font-medium">CORS Policy Issue</span>
                </div>
                <p className="text-xs text-blue-700 mb-2">
                  Lovable preview cannot connect to localhost due to browser security.
                </p>
                <div className="text-xs text-blue-600 space-y-1">
                  <p className="font-medium">Solutions:</p>
                  <p>1. Use ngrok to expose your backend: <code className="bg-blue-100 px-1 py-0.5 rounded">ngrok http 5000</code></p>
                  <p>2. Deploy your backend to a cloud service</p>
                  <p>3. Run the frontend locally: <code className="bg-blue-100 px-1 py-0.5 rounded">npm run dev</code></p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
