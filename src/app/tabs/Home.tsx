import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* =========================
            HEADER / HERO SECTION
        ========================== */}

        <View style={styles.heroSection}>

          <Text style={styles.logo}>
            SPACZ
          </Text>

          <Text style={styles.greeting}>
            Hey! 👋
          </Text>

          <Text style={styles.userName}>
            Ranjit Kodipyaka
          </Text>


          {/* =========================
              STUDY CENTRE CARD
          ========================== */}

          <TouchableOpacity style={styles.serviceCard}>

            <Text style={styles.serviceArrow}>
              →
            </Text>

            <Text style={styles.serviceTitle}>
              Study Center
            </Text>

            <Text style={styles.serviceDescription}>
              Find and book your slot in one of the best
              and nearest study center
            </Text>

          </TouchableOpacity>


          {/* =========================
              MEAL CARD
          ========================== */}

          <TouchableOpacity style={styles.serviceCard}>

            <Text style={styles.serviceArrow}>
              →
            </Text>

            <Text style={styles.serviceTitle}>
              Meal Cards
            </Text>

            <Text style={styles.serviceDescription}>
              Find and book your slot in one of the best
              and nearest study center
            </Text>

          </TouchableOpacity>

        </View>


        {/* =========================
            EXCLUSIVE SECTION
        ========================== */}

        <View style={styles.section}>

          <Text style={styles.sectionTitle}>
            Exclusively for you
          </Text>


          <TouchableOpacity style={styles.exclusiveCard}>

            <Text style={styles.exclusiveText}>
              Exclusive Offers
            </Text>

          </TouchableOpacity>


          {/* Carousel dots */}

          <View style={styles.dotsContainer}>

            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />

          </View>

        </View>


        {/* =========================
            RECOMMENDED SECTION
        ========================== */}

        <View style={styles.section}>

          <Text style={styles.sectionTitle}>
            Recommended
          </Text>

          <View style={styles.placeholderCard}>
            <Text style={styles.placeholderText}>
              Recommended Study Centres
            </Text>
          </View>

        </View>


        {/* =========================
            TOP RATED SECTION
        ========================== */}

        <View style={styles.section}>

          <Text style={styles.sectionTitle}>
            Top Rated
          </Text>

          <View style={styles.placeholderCard}>
            <Text style={styles.placeholderText}>
              Top Rated Study Centres
            </Text>
          </View>

        </View>


        {/* =========================
            FOOTER
        ========================== */}

        <View style={styles.footer}>

          <Text style={styles.footerLogo}>
            SPACZ
          </Text>

          <Text style={styles.footerText}>
            Lorem ipsum dolor sit amet consectetur.
            {'\n'}
            Tempor fermentum
          </Text>

        </View>

      </ScrollView>

    </View>
  );
}


const styles = StyleSheet.create({

  /* MAIN SCREEN */

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  scrollContent: {
    paddingBottom: 40,
  },


  /* =========================
      HERO
  ========================== */

  heroSection: {
    backgroundColor: '#4B6FE8',

    paddingHorizontal: 44,
    paddingTop: 45,
    paddingBottom: 40,

    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  logo: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '600',

    marginBottom: 75,
  },

  greeting: {
    color: '#FFFFFF',
    fontSize: 44,
    fontWeight: '300',
  },

  userName: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: '800',

    marginTop: 5,
    marginBottom: 55,
  },


  /* =========================
      SERVICE CARDS
  ========================== */

  serviceCard: {
    backgroundColor: '#756CE4',

    borderRadius: 16,

    minHeight: 250,

    marginBottom: 50,

    paddingHorizontal: 42,
    paddingVertical: 35,

    position: 'relative',
  },

  serviceArrow: {
    position: 'absolute',

    right: 40,
    top: 35,

    color: '#FFFFFF',

    fontSize: 35,
    fontWeight: '300',
  },

  serviceTitle: {
    color: '#FFFFFF',

    fontSize: 27,
    fontWeight: '800',

    marginTop: 90,
  },

  serviceDescription: {
    color: '#FFFFFF',

    fontSize: 17,
    lineHeight: 23,

    marginTop: 14,

    maxWidth: 440,
  },


  /* =========================
      SECTIONS
  ========================== */

  section: {
    paddingHorizontal: 44,

    paddingTop: 60,
  },

  sectionTitle: {
    fontSize: 29,

    fontWeight: '800',

    color: '#333333',

    marginBottom: 30,
  },


  /* =========================
      EXCLUSIVE
  ========================== */

  exclusiveCard: {
    height: 260,

    borderRadius: 16,

    backgroundColor: '#FFB365',

    justifyContent: 'center',
    alignItems: 'center',
  },

  exclusiveText: {
    fontSize: 24,

    fontWeight: '700',

    color: '#FFFFFF',
  },


  /* =========================
      DOTS
  ========================== */

  dotsContainer: {
    flexDirection: 'row',

    justifyContent: 'center',

    alignItems: 'center',

    gap: 15,

    marginTop: 28,
  },

  dot: {
    width: 15,
    height: 15,

    borderRadius: 8,

    backgroundColor: '#E5E5E5',
  },

  activeDot: {
    backgroundColor: '#1677ED',
  },


  /* =========================
      RECOMMENDED / TOP RATED
  ========================== */

  placeholderCard: {
    height: 180,

    borderRadius: 16,

    backgroundColor: '#F4F4F4',

    justifyContent: 'center',
    alignItems: 'center',
  },

  placeholderText: {
    color: '#999999',

    fontSize: 17,
  },


  /* =========================
      FOOTER
  ========================== */

  footer: {
    paddingHorizontal: 60,

    paddingTop: 100,

    paddingBottom: 80,
  },

  footerLogo: {
    color: '#A7A7A7',

    fontSize: 44,

    fontWeight: '800',
  },

  footerText: {
    color: '#A7A7A7',

    fontSize: 19,

    lineHeight: 27,

    marginTop: 15,
  },

});