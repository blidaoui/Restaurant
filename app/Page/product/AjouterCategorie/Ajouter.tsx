export function AjouterCategories(id :any, title :any , image :any , Index :any){
    const shopDataString = localStorage.getItem("shop");
    const shopData = shopDataString ? JSON.parse(shopDataString) : {};


    let categories ={
        ...shopData[Index]?.card.categories
    }
    let NEwCategories  =  {
        id: id,
        color: "#FFFFFF",
        items: [],
        title: title,
        idCard: 1,
        imageUrl: {
          Default: {
            urlDefault:image,
            salesSupport: [],
          },
          override: [
            {
              shopId: "",
            },
            {
              info: [],
              salesSupport: [],
            },
          ],
        },}
      categories[id]={...NEwCategories}

    shopData[Index] = {
        ...shopData[Index],
        card: {
            ...shopData[Index]?.card,
            categories:categories
        }
    };
    localStorage.setItem("shop", JSON.stringify(shopData));

    // Retrieve card data from local storage
    const shopCardString = localStorage.getItem("card");
    const shopCardData = shopCardString ? JSON.parse(shopCardString) : {};

    // Add the new category to the card data
    shopCardData.categories[id] = { ...NEwCategories };

    // Update local storage with the modified card data
    localStorage.setItem("card", JSON.stringify(shopCardData));

    return   NEwCategories
    
  
    

}