package com.google.appinventor.server.project.youngandroid;

import java.util.ArrayList;

public class ParseResult {
    
    public ArrayList<String> assetFiles;
    public ArrayList<String> bodyHtml;
    public ArrayList<String> css;
    public ParseResult()
    {
        this.assetFiles = new ArrayList<String>();
        this.bodyHtml = new ArrayList<String>();
        this.css = new ArrayList<String>();
    }
}
