import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';

const InvoicePDF = ({ PDFData,productDetails,productDetailForm,setProductDetailForm,selectedPrintMethods }) => (
    <Document>
        <Page style={styles.page}>
            <View style={{ borderStyle: 'solid', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 5 }}>
                <View style={{ width: "100%", display: "flex", flexDirection: 'row', justifyContent: "space-between", alignItems: "center", height: "40px", paddingBottom: 15, paddingTop: 10 }}>
                    <Image src="/images/wlb_logo_black.png" style={{ height: "40px", marginTop: 5 }} />
                    <View style={{ display: "flex", flexDirection: 'row', justifyContent: "space-between", alignItems: "center", columnGap: "5px", paddingTop: 5, marginRight: 5 }}>
                        <Image style={{ width: '22px', height: '22px' }} src="/images/facebook_icon.png" />
                        <Image style={{ width: '22px', height: '22px' }} src="/images/Instagram_icon.png" />
                    </View>
                </View>
                {PDFData?.product_details ? (
                    <View style={styles.productDetails}>
                        <Image src={PDFData?.product_details?.image} style={styles.image} />
                        <View style={styles.details}>
                            <View style={styles.header}>
                                
                                <Text style={styles.internalCode}>{PDFData?.product_details?.internal_code}</Text>
                            </View>
                            <Text style={styles.name}>{PDFData?.product_details?.name}</Text>
                            <Text style={styles.description}>{PDFData?.product_details?.description}</Text>
                        </View>
                    </View>
                ):(
                    <View style={styles.productDetails}>
                        <Image src={productDetails?.images[0].url} style={styles.image} />
                        <View style={styles.details}>
                            <View style={styles.header}>
                                
                                <Text style={styles.internalCode}>{productDetails?.internal_code}</Text>
                            </View>
                            <Text style={styles.name}>{productDetails?.name}</Text>
                            <Text style={styles.description}>{productDetails?.long_description}</Text>
                        </View>
                    </View>
                )}
                <View style={ styles.productDetailsCard }>
                    <View >
                        <Text style={styles.description}>Product Type - {productDetailForm.branding ? "Branded" : "unBranded"}</Text>
                        <Text style={styles.descriptionFor}>Product Color- {PDFData?.product_details?.colour}</Text>
                        {productDetailForm.branding&&
                        <View style={{flexDirection:'col',}}>
                            <Text style={styles.descriptionFor}>Print Method / Additional Cost</Text>
                            <View>
                  
                  {selectedPrintMethods.map((each, index) => (
                                          <View key={index}>
                                          <Text style={styles.heading}>{each.name} - Unit <Text>{each.quantity}</Text></Text>
                                          <Text style={styles.heading}>{each.dimensions}</Text>
                                          </View>
                                       ))}
                 
                  </View>
                           
                         </View>
                         }
                         {productDetailForm.branding&&
                         <View style={{justifyContent:'flex-start'}}>
                         <Text style={styles.descriptionFor}>Print File - </Text>
                  {productDetailForm.uploadYourDesignUrls.map((each, index) => (
                                          
                                             <Text key={index} style={styles.heading}>{each.name}</Text>
                                  
                                          ))}
                  </View>
                  }
                    </View>
                   
                    <View style={{flexDirection:'col',width:'30%'}}>
                           <View style={{flexDirection:'row',}}>
                              <Text style={styles.descriptionFor}>Qty: </Text>      
                              <Text style={styles.heading}> {productDetailForm.quantity}</Text>
                          </View>
                          <View style={{flexDirection:'row',}} >
                              <Text style={styles.descriptionFor}>Unit Price:</Text>      
                              <Text style={styles.heading}> ${productDetailForm.price.toFixed(2)}</Text>
                          </View>
                          <View style={{flexDirection:'row',}} >
                              <Text style={styles.descriptionFor}>Total:</Text>      
                              <Text style={styles.headingPrice}>${productDetailForm.totalPrice.toFixed(2)}</Text>
                         </View>
                    </View>
                </View>
                <View style={styles.section}>
                    {PDFData?.product_price_objects && (
                        <View style={styles.table}>
                           
                            <View style={styles.tableSubHeader}>
                                <Text style={styles.tableCell}>Qty</Text>
                                {PDFData.product_price_objects.map(({ quantity }, index) => (
                                    <Text key={index} style={styles.tableCell}>{quantity}</Text>
                                ))}
                            </View>
                            <View style={styles.tableRow}>
                                <Text style={styles.tableCell}>Price (unit)</Text>
                                {PDFData.product_price_objects.map(({ price }, index) => (
                                    <Text key={index} style={styles.tableCell}>{price.toFixed(2)}</Text>
                                ))}
                            </View>
                            <View style={styles.tableRow}>
                                <Text style={styles.tableCell}>Price (subtotal)</Text>
                                {PDFData.product_price_objects.map(({ price, quantity }, index) => (
                                    <Text key={index} style={styles.tableCell}>${(price * quantity).toFixed(2)}</Text>
                                ))}
                            </View>
                        </View>
                    )}
                    
                </View>
                <View style={{marginTop: 10, paddingTop: 10, paddingBottom: 10, borderTopStyle: 'solid', borderTopWidth: 1, borderTopColor:'#D1D5DB', fontSize: 10,paddingLeft: 10,}}>
                <Text>Note: All prices exclude GST, processing fees and shipping costs</Text>
                    <Text >Shipping cost - $15 NZ wide and above $500 FREE SHIPPING.</Text>
                    <Text >If you have any questions, email info@welovebranding.co.nz or contact us at 09 623 6666</Text>
                    
                </View>
            </View>
        </Page>
    </Document>
);

Font.register({
    family: "Montserrat",
    fonts: [
        { src: '/fonts/montserrat.ttf' },
        { src: '/fonts/Montserrat SemiBold.ttf', fontWeight: 500 },
      ],
})

const styles = StyleSheet.create({
    section: {
        flexGrow: 1,
        marginBottom: 0,
    },
    header: {
        backgroundColor: '#8A1E41',
        color: '#FFF',
        padding: 10,
        textAlign: 'center',
        marginBottom: 5,
        fontSize: 16,
        fontWeight: 'bold',
    },
    table: {
        width: '100%',
        borderStyle: 'solid',
        borderWidth: 0,
        borderColor: '#D1D5DB',
        borderCollapse: 'collapse',
        borderRadius: 5,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#8A1E41',
        color: '#FFF',
        fontSize: 12,
        padding: 10,
        textAlign: "center",
        fontWeight: 'bold',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
    tableSubHeader: {
        flexDirection: 'row',
        // backgroundColor: '#F7F7F7',
        color: 'black',
        fontSize: 12,
        padding: 5,
        textAlign: "center",
        fontWeight: 'bold',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#e5e7eb',
        borderCollapse: 'collapse',
    },
    tableCell: {
        padding: 10,
        fontSize: 10,
        borderStyle: 'solid',
        borderWidth: 0,
        textAlign: 'center',
        flex: 1,
        borderCollapse: 'collapse',
    },
    page: {
        fontFamily: 'Montserrat',
        padding: 20,
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#D1D5DB'
    },
    productDetails: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingTop: 10,
        paddingBottom: 10,
        borderTopStyle: 'solid',
        borderTopWidth: 1,
        borderColor: '#D1D5DB',
    },
    productDetailsCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      // alignItems: 'flex-start',
      paddingTop: 10,
      paddingBottom: 10,
      borderTopStyle: 'solid',
      borderTopWidth: 1,
      borderColor: '#D1D5DB',
      margin:10,
      backgroundColor: '#F7F7F7',
      padding:10,
  },
    image: {
        width: 225,
        height: 225,
        marginRight: 20,
    },
    details: {
        flex: 1,
        paddingTop: 5,
        paddingRight: 10
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#E5E7EB',
        marginBottom: 16,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingBottom: 20,
    },
    internalCode: {
        fontSize: 12,
        fontWeight: 'semibold',
        color: "#8A1E41",
    },
    description: {
        fontSize: 12,
        lineHeight: 1.5,
        // color: "#707070"
        color: '#000000'
    },
    descriptionFor: {
      fontSize: 12,
      lineHeight: 1.5,
      color: "#000000",
      width: '50%'
  },
  headingPrice: {
    fontSize: 12,
    lineHeight: 1.5,
    color: "#707070",
    fontWeight:'bold',
    color: "#8A1E41",
},
heading: {
  fontSize: 12,
  lineHeight: 1.5,
  color: "#707070",
  fontWeight: 800,
  color: '#000000'
},

});

export default InvoicePDF;