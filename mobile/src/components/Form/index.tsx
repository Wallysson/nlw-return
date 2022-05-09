import React, {useState} from 'react';
import { ArrowLeft } from 'phosphor-react-native';
import { View, TextInput, Image, Text, TouchableOpacity } from 'react-native';
import { theme } from '../../theme';
import  { feedbackTypes } from '../../utils/feedbackTypes';
import  { captureScreen } from 'react-native-view-shot'
import { FeedbackType } from '../../components/Widget';
import { Screenshot } from '../../components/Screenshot';
import { Button } from '../../components/Button';
import { styles } from './styles';
import { api } from '../../libs/api';
import * as FileSystem from 'expo-file-system'

interface Props {
  feedbackType: FeedbackType;
  onFeedbackCanceled: () => void;
  onFeedbackSent: () => void;
}

export function Form({feedbackType, onFeedbackCanceled, onFeedbackSent}: Props) {
  const [isSendindFeedback, setIsSendingFeedback] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [comment, setComment] = useState('');

  const feedbackTypeInfo = feedbackTypes[feedbackType];

  function handleScreenshot() {
    captureScreen({
      format: 'jpg',
      quality: 0.8
    }) 
    .then(uri => setScreenshot(uri))
    .catch(error => console.error(error))
  }

  function handleRemoveScreenshot() {
    setScreenshot(null)
  }

  async function handleSendFeedback() {
    if (isSendindFeedback) {
      return;
    }
    setIsSendingFeedback(true);
    const screenshotBase64 = screenshot && await FileSystem.readDirectoryAsync(screenshot, {encoding: 'base64'});

    try{
      await api.post('/feedbacks', {
        type: feedbackType,
        screenshot: `data:image/png;base64,${screenshotBase64}`,
        comment
      });

      onFeedbackSent();
      
    } catch(error) {
      console.error(error);
      setIsSendingFeedback(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onFeedbackCanceled}>
          <ArrowLeft 
            size={24}
            weight="bold"
            color={theme.colors.text_secondary}
          />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Image 
            source={feedbackTypeInfo.image}
            style={styles.image}
          />
          <Text style={styles.titleText}>
            {feedbackTypeInfo.title}
          </Text>
        </View>
      </View>

      <TextInput
        multiline
        style={styles.input}
        placeholder="Conte com detalhes o que está acontecendo..."
        placeholderTextColor={theme.colors.text_secondary}
        autoCorrect={false}
        onChangeText={setComment}
      >
      </TextInput>

      <View style={styles.footer}>
        <Screenshot 
          onTakeShot={handleScreenshot}
          onRemoveShot={handleRemoveScreenshot}
          screenshot={screenshot}
        />

        <Button 
          onPress={handleSendFeedback}
          isLoading={isSendindFeedback}
        />
      </View>
    </View>
  );
}