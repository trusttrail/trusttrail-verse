
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const NFTCreateForm = () => {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create NFT</CardTitle>
        <CardDescription>Upload and mint your digital creation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Upload File</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-muted-foreground">Drag and drop or click to upload</p>
            <p className="text-sm text-muted-foreground mt-2">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
        <div>
          <label htmlFor="nft-name" className="block text-sm font-medium mb-2">Name</label>
          <Input id="nft-name" placeholder="Enter NFT name" />
        </div>
        <div>
          <label htmlFor="nft-description" className="block text-sm font-medium mb-2">Description</label>
          <Input id="nft-description" placeholder="Describe your NFT" />
        </div>
        <div>
          <label htmlFor="nft-price" className="block text-sm font-medium mb-2">Price (ETH)</label>
          <Input id="nft-price" type="number" placeholder="0.00" />
        </div>
        <Button className="w-full bg-gradient-to-r from-trustpurple-500 to-trustblue-500">
          Create NFT
        </Button>
      </CardContent>
    </Card>
  );
};

export default NFTCreateForm;
