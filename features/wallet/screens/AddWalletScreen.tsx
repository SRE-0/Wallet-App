import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";

import { useThemeColors } from "@/hooks/use-theme-color";
import { FontAwesome6 } from "@expo/vector-icons";
import { createStyles } from "./add_wallet.styles";
import { width } from "@/constants/width";

import { CustomInput } from "@/components/custom-input/CustomInput";

import { BackgroundWidget } from "@/components/background-widget/background-widget";

export const AddWalletScreen = ({ }) => {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <BackgroundWidget>
        <View style={styles.container}>
            <KeyboardAvoidingView
            style={styles.containerCard}
            >
                <Text style={styles.headerTitle}>Add New Wallet</Text>
                <Text style={styles.headerSubTitle}>Enter your wallet details to get started</Text>
            
                <CustomInput 
                    iconName="credit-card" 
                    placeholder="Name of card" 
                    keyboardType="default"
                    maxLength={50}
                />

                <CustomInput 
                    iconName="money-bill-1" 
                    placeholder="Amount" 
                    keyboardType="number-pad"
                    maxLength={20}
                />

                <TouchableOpacity
                    style={styles.settingButton}>
                    <View style={styles.contentIcon}>
                        <FontAwesome6 style={styles.otherCardsIcon} name="dollar-sign" size={width.icon_md} />
                    </View>
                    <View style={styles.settingContainer}>
                        <Text style={styles.settingTitle}>Currency</Text>
                        <Text style={styles.settingSubTitle}>USD</Text>
                    </View>
                </TouchableOpacity>
                    
                <TouchableOpacity style={styles.actionButton}>
                    <FontAwesome6 style={styles.actionIcon} name="circle-plus" size={width.icon_md} />
                    <Text style={styles.actionButtonText}>Add Card</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
    </BackgroundWidget>
  );
};