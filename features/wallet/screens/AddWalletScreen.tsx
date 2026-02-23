import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { useThemeColors } from "../../../hooks/use-theme-color";
import { FontAwesome6 } from "@expo/vector-icons";
import { createStyles } from "./add_wallet.styles";
import { width } from "@/constants/width";

import { BackgroundWidget } from "@/components/background/background-widget";

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

                <View style={styles.rowCard}>
                    <View style={styles.contentIcon}>
                        <FontAwesome6 style={styles.otherCardsIcon} name="credit-card" size={width.icon_md} />
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        placeholderTextColor={colors.onBackground}
                        //value={email}
                        //onChangeText={setEmail}
                        keyboardType="text"
                        autoCapitalize="true"
                        maxLength={50}
                    />
                </View>
                
                <View style={styles.rowCard}>
                    <View style={styles.contentIcon}>
                        <FontAwesome6 style={styles.otherCardsIcon} name="money-bill-1" size={width.icon_md} />
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Amount"
                        placeholderTextColor={colors.onBackground}
                        //value={email}
                        //onChangeText={setEmail}
                        keyboardType="number-pad"
                        maxLength={10}
                    />
                </View>

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