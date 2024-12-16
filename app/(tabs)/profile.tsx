import { Button, View } from 'react-native'

import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelectedLanguage } from '@/i18n/utils'
import { ThemedText } from '@/components/ThemedText'
import { useAuthContext } from '@/context/AuthContext'
import { Link } from 'expo-router'

export default function Profile() {
  const { language, setLanguage } = useSelectedLanguage()
  const {
    session: { authenticated, user },
    signOut
  } = useAuthContext()
  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1 m-2">
        <View className="flex-row">
          <ThemedText type="defaultSemiBold">
            Selected Language : {language}
          </ThemedText>
          <Button title="EN" onPress={() => setLanguage('en')} />
          <Button title="ES" onPress={() => setLanguage('es')} />
        </View>
        {authenticated ? (
          <>
            <ThemedText>LoggedIn User</ThemedText>
            <ThemedText>{user?.name}</ThemedText>
            <ThemedText>{user?.email}</ThemedText>
            <Button title="logout" onPress={signOut}></Button>
          </>
        ) : (
          <Link href={'/login'}>
            <ThemedText>Login</ThemedText>
          </Link>
        )}
      </View>
    </SafeAreaView>
  )
}
