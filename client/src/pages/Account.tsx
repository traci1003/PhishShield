import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, User, HelpCircle, CreditCard, Lock, LogOut } from "lucide-react";

export default function Account() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Account</h1>
        <p className="text-gray-600">
          Manage your account and subscription
        </p>
      </div>
      
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <div className="rounded-full bg-primary-100 p-3 mr-3">
                <User className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-medium">Demo User</h3>
                <p className="text-sm text-gray-500">demo@example.com</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              <Lock className="h-4 w-4 mr-2" />
              Change Password
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Subscription</CardTitle>
            <CardDescription>You are currently on the free plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-primary-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-primary-700 flex items-center mb-2">
                <Shield className="h-5 w-5 mr-2" />
                PhishShield Free
              </h3>
              <ul className="text-sm space-y-2">
                <li className="flex items-center">
                  <span className="material-icons text-primary-600 mr-2 text-sm">check</span>
                  Basic SMS Protection
                </li>
                <li className="flex items-center">
                  <span className="material-icons text-primary-600 mr-2 text-sm">check</span>
                  Basic Email Protection
                </li>
                <li className="flex items-center">
                  <span className="material-icons text-gray-400 mr-2 text-sm">close</span>
                  <span className="text-gray-500">Social Media Protection</span>
                </li>
                <li className="flex items-center">
                  <span className="material-icons text-gray-400 mr-2 text-sm">close</span>
                  <span className="text-gray-500">On-Device Scanning</span>
                </li>
                <li className="flex items-center">
                  <span className="material-icons text-gray-400 mr-2 text-sm">close</span>
                  <span className="text-gray-500">Priority Support</span>
                </li>
              </ul>
            </div>
            <Button className="w-full bg-primary-600 hover:bg-primary-700">
              <CreditCard className="h-4 w-4 mr-2" />
              Upgrade to Premium
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Help & Support</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <HelpCircle className="h-4 w-4 mr-2" />
              FAQ
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <span className="material-icons text-sm mr-2">contact_support</span>
              Contact Support
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <span className="material-icons text-sm mr-2">privacy_tip</span>
              Privacy Policy
            </Button>
          </CardContent>
        </Card>
        
        <Button variant="outline" className="w-full text-gray-600 mt-6">
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
