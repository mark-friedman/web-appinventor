package com.google.appinventor.server.project.youngandroid;

public abstract class ImageComponent extends Component {

  String imageSrcPrefix;

  public String getImageSrcPrefix() {
    return imageSrcPrefix;
  }

  public void setImageSrcPrefix(String prefix) {
    this.imageSrcPrefix = prefix;
  }

  /* This property helps build the file name for the asset file 
   * Do not make the return value css or html specific, or you 
   * will break the retrieval of the asset from storage.
   */
  public String getPrefixedSrc(String src) {

    if ((imageSrcPrefix == null) || (imageSrcPrefix == "")) 
    {
      // return whatever the input string is 
      return src;
    }
    else if ((src == null) || (src == ""))
    {
      // If no source value, then just return empty string
      // Nothing to prefix in this case
      return "";
    }
    else {
      return imageSrcPrefix + src;
    }
  }
}

