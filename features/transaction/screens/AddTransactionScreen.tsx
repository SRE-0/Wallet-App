import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";

import { useThemeColors } from "@/hooks/use-theme-color";
import { FontAwesome6 } from "@expo/vector-icons";
import { createStyles } from "./AddTransaction.styles";
import { width } from "@/constants/width";

import { CustomInput } from "@/components/custom-input/CustomInput";

import { BackgroundWidget } from "@/components/background-widget/background-widget";

export const AddTransactionScreen = ({ }) => {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <BackgroundWidget>
        <View style={styles.container}>
            <KeyboardAvoidingView
            style={styles.containerCard}
            >
                <Text style={styles.headerTitle}>Add New Transaction</Text>
                <Text style={styles.headerSubTitle}>Enter your transaction details to get started</Text>
            
                <CustomInput 
                    iconName="arrow-up-a-z" 
                    placeholder="Name" 
                    keyboardType="numeric"
                    maxLength={50}
                />
                
                <CustomInput 
                    iconName="money-bills" 
                    placeholder="Amount" 
                    keyboardType="numeric"
                    maxLength={50}
                />

                <CustomInput 
                    iconName="money-bill-trend-up" 
                    placeholder="Tax (max. 100%)" 
                    keyboardType="numeric"
                    maxLength={50}
                />



                
                

                <TouchableOpacity
                    style={styles.settingButton}>
                    <View style={styles.contentIcon}>
                        <FontAwesome6 style={styles.otherCardsIcon} name="dollar-sign" size={width.icon_md} />
                    </View>
                    <View style={styles.settingContainer}>
                        <Text style={styles.settingTitle}>Category</Text>
                        <Text style={styles.settingSubTitle}>Finance</Text>
                    </View>
                </TouchableOpacity>
                    
                <TouchableOpacity style={styles.actionButton}>
                    <FontAwesome6 style={styles.actionIcon} name="circle-plus" size={width.icon_md} />
                    <Text style={styles.actionButtonText}>Add Transaction</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
    </BackgroundWidget>
  );
};