import { useQuery, useMutation } from "@tanstack/react-query";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function ProtectionStatus() {
  const { data: settings, isLoading } = useQuery({
    queryKey: ['/api/protection-settings'],
  });

  const { toast } = useToast();

  const updateMutation = useMutation({
    mutationFn: async (updates: any) => {
      const response = await apiRequest('PATCH', '/api/protection-settings', updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/protection-settings'] });
      toast({
        title: "Settings updated",
        description: "Your protection settings have been updated.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update settings.",
      });
    }
  });

  const handleToggleProtection = (key: string, value: boolean) => {
    updateMutation.mutate({ [key]: value });
  };

  return (
    <section className="mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Protection Status</h2>
      
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm divide-y">
          <ProtectionItem 
            icon="phone_android"
            title="SMS Protection"
            description="Scanning incoming messages"
            enabled={settings?.smsProtection}
            onChange={(value) => handleToggleProtection('smsProtection', value)}
          />
          
          <ProtectionItem 
            icon="email"
            title="Email Protection"
            description="Scanning messages and links"
            enabled={settings?.emailProtection}
            onChange={(value) => handleToggleProtection('emailProtection', value)}
          />
          
          <ProtectionItem 
            icon="chat"
            title="Social Media Protection"
            description="Not available in free plan"
            enabled={settings?.socialMediaProtection}
            onChange={(value) => handleToggleProtection('socialMediaProtection', value)}
            disabled={true}
          />
          
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <span className="material-icons text-primary-600 mr-3">privacy_tip</span>
              <div>
                <h3 className="font-medium text-gray-900">On-Device Scanning</h3>
                <p className="text-xs text-gray-500">Enhanced privacy (Premium)</p>
              </div>
            </div>
            <Button size="sm" className="rounded-full text-xs bg-primary-600 hover:bg-primary-700">
              Upgrade
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}

interface ProtectionItemProps {
  icon: string;
  title: string;
  description: string;
  enabled?: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

function ProtectionItem({ 
  icon, 
  title, 
  description, 
  enabled = false, 
  onChange,
  disabled = false
}: ProtectionItemProps) {
  return (
    <div className="p-4 flex items-center justify-between">
      <div className="flex items-center">
        <span className="material-icons text-primary-600 mr-3">{icon}</span>
        <div>
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      <Switch 
        checked={enabled} 
        onCheckedChange={onChange}
        disabled={disabled}
        className={disabled ? "opacity-50" : ""}
      />
    </div>
  );
}
