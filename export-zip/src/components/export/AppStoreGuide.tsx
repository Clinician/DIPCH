import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";

const AppStoreGuide: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">App Store Submission Guide</h1>
      
      <Tabs defaultValue="export" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="export">Export Project</TabsTrigger>
          <TabsTrigger value="prepare">Prepare for iOS</TabsTrigger>
          <TabsTrigger value="submit">App Store Submission</TabsTrigger>
        </TabsList>
        
        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exporting the Project</CardTitle>
              <CardDescription>
                Follow these steps to export your Implant Pass project for iOS development
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Step 1: Build the Web Application</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Open your terminal in the project directory</li>
                  <li>Run <code className="bg-gray-100 px-2 py-1 rounded">npm run build</code> to create a production build</li>
                  <li>Verify the build was successful and check the <code className="bg-gray-100 px-2 py-1 rounded">dist</code> folder for output files</li>
                </ol>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-2">Step 2: Download the Project Files</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Click on the "Git" tab in the left panel of Tempo</li>
                  <li>If you haven't already, connect to your own repository using the "Connect Repo" button</li>
                  <li>Commit and push all changes to your repository</li>
                  <li>Clone your repository locally using <code className="bg-gray-100 px-2 py-1 rounded">git clone [your-repo-url]</code></li>
                </ol>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-2">Step 3: Prepare Project Structure for Native Conversion</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Create a new folder for your iOS project</li>
                  <li>Copy the <code className="bg-gray-100 px-2 py-1 rounded">dist</code> folder to this new directory</li>
                  <li>Create a <code className="bg-gray-100 px-2 py-1 rounded">metadata</code> folder for App Store assets</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="prepare" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preparing for iOS</CardTitle>
              <CardDescription>
                Steps to convert your web application to a native iOS app
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Step 1: Set Up Xcode Project</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Install Xcode from the Mac App Store if you haven't already</li>
                  <li>Open Xcode and create a new iOS project using the "App" template</li>
                  <li>Set the product name to "Implant Pass"</li>
                  <li>Choose your team and organization identifier (e.g., com.yourcompany.implantpass)</li>
                  <li>Select Swift as the programming language and SwiftUI for the interface</li>
                  <li>Choose a location to save the project</li>
                </ol>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-2">Step 2: Integrate WKWebView</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Open the ContentView.swift file</li>
                  <li>Replace the default code with a WKWebView implementation that loads your web app</li>
                  <li>Add the necessary imports: <code className="bg-gray-100 px-2 py-1 rounded">import WebKit</code></li>
                  <li>Create a WebView struct that wraps WKWebView</li>
                  <li>Configure the WebView to load your local HTML files from the bundle</li>
                </ol>
                <div className="bg-gray-100 p-4 rounded-md mt-2 overflow-x-auto">
                  <pre className="text-sm">{`import SwiftUI
import WebKit

struct WebView: UIViewRepresentable {
    func makeUIView(context: Context) -> WKWebView {
        let webView = WKWebView()
        let preferences = WKWebpagePreferences()
        preferences.allowsContentJavaScript = true
        webView.configuration.defaultWebpagePreferences = preferences
        
        // Enable camera access
        webView.configuration.mediaTypesRequiringUserActionForPlayback = []
        
        if let url = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "dist") {
            webView.loadFileURL(url, allowingReadAccessTo: url.deletingLastPathComponent())
        }
        
        return webView
    }
    
    func updateUIView(_ uiView: WKWebView, context: Context) {}
}

struct ContentView: View {
    var body: some View {
        WebView()
            .edgesIgnoringSafeArea(.all)
    }
}
`}</pre>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-2">Step 3: Add Required Permissions</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Open the Info.plist file</li>
                  <li>Add the following permission keys:</li>
                </ol>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li><code className="bg-gray-100 px-2 py-1 rounded">NSCameraUsageDescription</code> - For QR code scanning</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">NSFaceIDUsageDescription</code> - For Face ID authentication</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">NSPhotoLibraryAddUsageDescription</code> - For saving QR codes</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="submit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>App Store Submission</CardTitle>
              <CardDescription>
                Final steps to prepare and submit your app to the App Store
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Step 1: Create App Store Assets</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Create app icons in various sizes (use an icon generator tool)</li>
                  <li>Prepare screenshots for different device sizes</li>
                  <li>Write app description, keywords, and privacy policy</li>
                  <li>Create a promotional video (optional)</li>
                </ol>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-2">Step 2: Configure App in App Store Connect</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Log in to <a href="https://appstoreconnect.apple.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">App Store Connect</a></li>
                  <li>Create a new app entry</li>
                  <li>Fill in all required metadata (name, description, keywords, etc.)</li>
                  <li>Upload screenshots and app preview</li>
                  <li>Configure app pricing and availability</li>
                  <li>Complete the App Privacy information</li>
                </ol>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-2">Step 3: Build and Upload with Xcode</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>In Xcode, select "Generic iOS Device" as the build target</li>
                  <li>Go to Product > Archive to create an app archive</li>
                  <li>When the archive is complete, the Organizer window will open</li>
                  <li>Select your archive and click "Distribute App"</li>
                  <li>Choose "App Store Connect" as the distribution method</li>
                  <li>Follow the prompts to upload your app</li>
                  <li>Once uploaded, go back to App Store Connect to submit for review</li>
                </ol>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-2">Step 4: Submit for Review</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>In App Store Connect, select your app and version</li>
                  <li>Verify all information is complete and accurate</li>
                  <li>Click "Submit for Review"</li>
                  <li>Answer any additional questions about content and compliance</li>
                  <li>Wait for Apple's review (typically 1-3 business days)</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppStoreGuide;